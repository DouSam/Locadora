var mongoose = require("mongoose");

var ClientSchema = new mongoose.Schema(
{
        cna : String, // Client name
        cpf : String, // CPF
        nrg : String, // RG
        cel : String, // Cellphone number
        tel : String, // Telefone number
        adr : String, // Main Address
        dad : [String], // Array of delivery address
        obs : String, // General observations
    },
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Client", ClientSchema);