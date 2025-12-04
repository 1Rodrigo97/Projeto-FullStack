// controllers/importController.js (VERSÃO FINAL E CORRIGIDA)

const fs = require('fs');
const csv = require('csv-parser');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const sequelize = require('../config/database');

/**
 * Funções auxiliares para mapeamento e validação de dados
 */
const processCsvData = async (model, filePath) => {
    
    const uniqueRecordsMap = new Map(); 

    const stream = fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            let mappedData = {};
            let uniqueKey;

            // Mapeamento Específico para Customers
            if (model === Customer) {
                mappedData = {
                    name: `${data['First Name']} ${data['Last Name']}`, 
                    email: data.Email,
                    phone: data['Phone 1']
                };
                uniqueKey = mappedData.email;
            } 
            // Mapeamento Específico para Products
            else if (model === Product) {
                mappedData = {
                    sku: data.Index, 
                    name: data.Name,
                    price: parseFloat(data.Price),
                    stock: parseInt(data.Stock) || 0
                };
                uniqueKey = mappedData.sku;
            }

            // FILTRAGEM DE DUPLICATAS
            if (uniqueKey) {
                uniqueRecordsMap.set(uniqueKey, mappedData);
            }
        })
        .on('end', async () => {
            const uniqueRecords = Array.from(uniqueRecordsMap.values());
            
            // Inserção em Massa
            try {
                // Limpa o banco de dados antes da importação
                await model.destroy({ where: {}, truncate: true }); 
                
                await model.bulkCreate(uniqueRecords, { 
                    updateOnDuplicate: model === Customer ? ['name', 'phone'] : ['name', 'price', 'stock'] 
                });
                
                console.log(`Dados de ${model.name} importados com sucesso: ${uniqueRecords.length} registros (após remover duplicatas).`);

            } catch (error) {
                console.error(`Erro durante o bulkCreate para ${model.name}:`, error.message);
                
            } finally {
                // 🚨 CORREÇÃO ESSENCIAL: Tentar deletar o arquivo e capturar o erro para evitar o crash do servidor
                try {
                    fs.unlinkSync(filePath);
                    console.log(`Arquivo temporário ${filePath} excluído com sucesso.`);
                } catch (cleanupError) {
                    console.error("Erro ao limpar o arquivo temporário (o servidor não vai cair):", cleanupError.message);
                }
            }
        });

    return new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });
};

/**
 * Lógica para upload de arquivo e chamada de processamento (exports.importData)
 */
exports.importData = (modelType) => async (req, res) => {
    // A checagem de autenticação/autorização já é feita no routes/importRoutes.js

    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    const filePath = req.file.path;
    let model;

    if (modelType === 'customers') {
        model = Customer;
    } else if (modelType === 'products') {
        model = Product;
    } else {
        // Se o tipo for inválido, o arquivo precisa ser excluído.
        try {
            fs.unlinkSync(filePath);
        } catch (e) {
            console.error('Erro ao excluir arquivo inválido:', e.message);
        }
        return res.status(400).json({ message: 'Tipo de modelo inválido.' });
    }

    try {
        // Não esperamos o processamento terminar, pois ele é demorado (100k registros)
        processCsvData(model, filePath); // Note: Não usamos 'await' aqui!
        
        return res.status(200).json({ message: `Importação de ${model.name} iniciada com sucesso. Verifique o console para o status final.` });
    } catch (error) {
        console.error('Erro no processamento CSV (antes do stream):', error);
        return res.status(500).json({ message: 'Erro ao processar o arquivo CSV.' });
    }
};