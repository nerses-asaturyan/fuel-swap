import { Contract, Wallet, Provider, Address, WalletUnlocked} from 'fuels';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../out/release/fuel-swap-abi.json');
const contractAbi = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const contractAddressString = '0xfeb46d5e0191979fedacd515bd2c07897bceaf58a437902bf4f6ea56a0ed4dd8';

async function getWalletBalances() {
  const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
  const mnemonic = '...';
  const wallet: WalletUnlocked = Wallet.fromMnemonic(mnemonic);
  wallet.connect(provider);

  const contractAddress = Address.fromB256(contractAddressString);
  const ID = 110;
  const recipient = { bits: Wallet.generate().address.toB256() };
  const asset_id = provider.getBaseAssetId(); 

  const contractInstance = new Contract(contractAddress, contractAbi, wallet);

  try {

const {waitForResult} = await contractInstance.functions.watch(ID,recipient)
      .txParams({ 
        variableOutputs: 1,
      })
      .callParams({
          forward: [0, asset_id],
        })
      .call()

    const { logs } = await waitForResult();
    console.log("logs: ",logs);
  } catch (error) {
    console.error('Error calling test_function function:', error);
  }
}

getWalletBalances().catch(console.error);