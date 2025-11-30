import { getContracts, updateContract } from './services/geminiService';
import { ContractStatus } from './types';

const setLatestContractToCompleted = async () => {
    const contracts = await getContracts();
    if (contracts.length === 0) {
        console.log("No contracts found.");
        return;
    }
    const latest = contracts[0];
    console.log(`Updating contract ${latest.id} (${latest.title}) to COMPLETED...`);

    const updated = { ...latest, status: ContractStatus.COMPLETED };
    await updateContract(updated);
    console.log("Contract updated successfully.");
};

setLatestContractToCompleted();
