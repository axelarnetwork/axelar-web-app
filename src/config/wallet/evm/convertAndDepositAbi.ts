export const convertAndDepositAbi = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "wrappedNativeAssetContractAddress",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "depositAddress",
                "type": "address"
            }
        ],
        "name": "depositAndTransfer",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]