import { Contract, Wallet, Provider, Address, WalletUnlocked, bn } from 'fuels';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../out/release/fuel-swap-abi.json');
const contractAbi = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const contractAddressString = '0x48281fa674ca8e1a36f1488f717b1f9012bfa7ffdd4105ae83e0a1db17819ba1';

async function getWalletBalances() {
  const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
  const mnemonic = '...';
  const wallet: WalletUnlocked = Wallet.fromMnemonic(mnemonic);
  wallet.connect(provider);

  const contractAddress = Address.fromB256(contractAddressString);
  const recipient = { bits: Wallet.generate().address.toB256() };
  const asset_id = { bits: provider.getBaseAssetId() }; 

  const contractInstance = new Contract(contractAddress, contractAbi, wallet);

  try {

        const { waitForResult } = await contractInstance.functions
        .transfer_to_address(recipient, asset_id, 100)
        .txParams({
            variableOutputs: 1,
        })
        .call();
 
        await waitForResult();
  } catch (error) {
    console.error('Error calling test_function function:', error);
  }
}

getWalletBalances().catch(console.error);