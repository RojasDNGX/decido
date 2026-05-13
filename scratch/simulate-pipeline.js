const { buildLayeredPrompt } = require('./services/ai/prompts/builder');

const input = "Tenho que marcar uma consulta médica, terminar o relatório do projeto para sexta-feira e lavar a louça.";

console.log("--- FREE PLAN PROMPT ---");
const freePrompt = buildLayeredPrompt('free', input);
console.log(freePrompt);

console.log("\n\n--- PRO PLAN PROMPT ---");
const proPrompt = buildLayeredPrompt('pro', input);
console.log(proPrompt);
