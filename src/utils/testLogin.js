import mongoose from "mongoose";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

async function testLogin() {
  try {
    // Conectar ao banco
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado ao MongoDB");

    // Listar todos os usuários (sem mostrar senhas)
    const users = await User.find({}).select("-password");
    console.log("\n📋 Usuários cadastrados:");
    users.forEach((user, index) => {
      console.log(
        `${index + 1}. Email: ${user.email}, Nome: ${user.name}, Role: ${
          user.role
        }`
      );
    });

    // Testar login com um email específico
    const testEmail = process.argv[2];
    const testPassword = process.argv[3];

    if (!testEmail || !testPassword) {
      console.log("\n⚠️  Para testar login, execute:");
      console.log("node src/utils/testLogin.js <email> <senha>");
      process.exit(0);
    }

    console.log(`\n🔍 Testando login para: ${testEmail}`);

    const user = await User.findOne({ email: testEmail }).select("+password");

    if (!user) {
      console.log("❌ Usuário não encontrado");
      process.exit(1);
    }

    console.log(`✅ Usuário encontrado: ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(
      `🔑 Hash da senha armazenado: ${user.password.substring(0, 20)}...`
    );

    const isPasswordValid = await user.comparePassword(testPassword);

    if (isPasswordValid) {
      console.log("✅ Senha correta!");
    } else {
      console.log("❌ Senha incorreta!");
    }
  } catch (error) {
    console.error("❌ Erro:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Conexão fechada");
  }
}

testLogin();
