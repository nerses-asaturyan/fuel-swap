import { Contract, Wallet, Provider, Address, WalletUnlocked, bn } from 'fuels';
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, '../out/release/fuel-swap-abi.json');
const contractAbi = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const contractAddressString = '0xc192dab653f3821360b738e618cefcf3d8113a8e617faf0e96bcd682ad7345d6';

async function getWalletBalances() {
  const provider = await Provider.create('https://testnet.fuel.network/v1/graphql');
  const mnemonic = '...';
  const wallet: WalletUnlocked = Wallet.fromMnemonic(mnemonic);
  wallet.connect(provider);

  const contractAddress = Address.fromB256(contractAddressString);
  const ID = 2;
  const recipient = { bits: Wallet.generate().address.toB256() };
  const asset_id = { bits: provider.getBaseAssetId() }; 
  const amount = 400;

  console.log("ID: ",ID,"recipient: ",recipient,"asset_id: ",asset_id,"amount: ",amount);

  const contractInstance = new Contract(contractAddress, contractAbi, wallet);

  try {
    const call = await contractInstance.functions.watch(recipient,asset_id,amount)
                                                  .txParams({
                                                              variableOutputs: 1,
                                                            })
                                                  .getTransactionRequest();
    const resources = await wallet.getResourcesToSpend([
      {
        amount: bn(100_000),
        assetId: provider.getBaseAssetId(),
      },
    ]);
    call.maxFee = bn(1000* 120);
    call.gasLimit = bn(400_000);
    call.addResources(resources);

    const txId = call.getTransactionId(provider.getChainId());
    const response = await wallet.sendTransaction(call, { estimateTxDependencies: false });
    console.log(response.id === txId ? "tx id: " + txId : "Failure");
  } catch (error) {
    console.error('Error calling test_function function:', error);
  }
}

getWalletBalances().catch(console.error);