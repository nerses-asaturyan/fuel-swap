import { Contract, Wallet, Provider, Address, WalletUnlocked,  EvmAddress, B256AddressEvm, AssetId, B256Address} from 'fuels';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../out/debug/fuel-swap-abi.json');
const contractAbi = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const contractAddressString = '0xfeb46d5e0191979fedacd515bd2c07897bceaf58a437902bf4f6ea56a0ed4dd8';

async function getWalletBalances() {
  const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
  const mnemonic = '...';
  const wallet: WalletUnlocked = Wallet.fromMnemonic(mnemonic);
  wallet.connect(provider);

  const contractAddress = Address.fromB256(contractAddressString);
  const ID = 133;
  const recipient = { bits: Wallet.generate().address.toB256() };

  const asset_id = provider.getBaseAssetId(); 

  const contractInstance = new Contract(contractAddress, contractAbi, wallet);

  // USDC asset ID
  const b256: B256Address =
    '0xC26C91055De37528492E7e97D91c6F4aBe34aaE26f2C4D25CFf6BFe45B5DC9a9';
  const address: Address = Address.fromB256(b256);
  const assetId: AssetId = address.toAssetId();

  const receiver = { bits: Address.fromDynamicInput("0x5512Be3DB4D620d30c638f14d32c6a21Eb0b3CD890C7a9064D0F249dCa957a7D").toB256()};

  try {
  const {waitForResult} = await contractInstance.functions.watch(ID,receiver)
        .txParams({ 
          variableOutputs: 1,
        })
        .callParams({
            forward: [1700000, assetId.bits],
          })
        .call()

      const { logs } = await waitForResult();
      console.log("logs: ",logs);
    } catch (error) {
      console.error('Error calling test_function function:', error);
    }
}

getWalletBalances().catch(console.error);