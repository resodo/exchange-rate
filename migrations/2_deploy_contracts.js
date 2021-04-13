const { table } = require('table');

const ExchangeRates = artifacts.require('ExchangeRates');
const Owned = artifacts.require('Owned');
const SafeDecimalMath = artifacts.require('SafeDecimalMath');

const rateStalePeriod = 300;

module.exports = async function(deployer, network, accounts) {
  console.log(accounts);
  const [deployerAccount, owner, oracle] = accounts;

  // Note: This deployment script is not used on mainnet, it's only for testing deployments.

	// The Owned contract is not used in a standalone way on mainnet, this is for testing
	// ----------------
	// Owned
	// ----------------
	await deployer.deploy(Owned, owner, { from: deployerAccount });

  // ----------------
	// Safe Decimal Math library
	// ----------------
	console.log('Deploying SafeDecimalMath...');
	await deployer.deploy(SafeDecimalMath, { from: deployerAccount });

  // ----------------
	// Exchange Rates
	// ----------------
	console.log('Deploying ExchangeRates...');
	deployer.link(SafeDecimalMath, ExchangeRates);
	const exchangeRates = await deployer.deploy(
		ExchangeRates,
		owner,
		oracle,
		rateStalePeriod,
		[web3.utils.asciiToHex('CFX')],
		[web3.utils.toWei('1.2', 'ether')],
		{ from: deployerAccount }
	);

  // Initial prices
  const { timestamp } = await web3.eth.getBlock('latest');

  const currencyKeys = ['BNB', 'ETH', 'CFX'];

	// BNB: 500 USD
	// ETH: 2000 USD
	// CFX: 0.1 USD
	await exchangeRates.updateRates(
		currencyKeys
			.filter(currency => currency !== 'USD')
			.map(web3.utils.asciiToHex),
		['500', '2000', '0.1'].map(number => web3.utils.toWei(number, 'ether')),
		timestamp,
		{ from: oracle }
	);


  const tableData = [
		['Contract', 'Address'],
		['Exchange Rates', ExchangeRates.address],
		['Owned', Owned.address],
		['SafeDecimalMath', SafeDecimalMath.address],
	];

  console.log();
	console.log();
	console.log(' Successfully deployed all contracts:');
	console.log();
	console.log(table(tableData));
}