# RN Ethereum Dapp Browser

This is a webview with web3 capabilities.  It depends on and integrates with [react-native-ethereum-wallet](https://modules.deco.network/chris/react-native-ethereum-wallet) and [react-native-ethereum-kit](https://modules.deco.network/chris/react-native-ethereum-kit).

# How it works

This webview injects a global web3 javascript object that any web page can utilize.  Many of the web3 functions are implemented including the ability to authorize and send a transaction or authorize and sign a message. 

When a dApp tries to initiate a transaction or message signing, a modal dialog is presented to the user where they can approve or reject the prompt.

# Dependencies

This project needs custom versions of a few dependencies.  Add these dependencies to your main project.  You can just do "npm install --save <url>".

* https://github.com/glitch003/react-native.git#amble-wallet
* https://github.com/glitch003/react-native-wkwebview.git
* https://github.com/glitch003/react-native-webbrowser-enhanced.git
* react-native-button-component

# Deconet Prerequisites

* [react-native-ethereum-wallet](https://modules.deco.network/chris/react-native-ethereum-wallet).   Follow the instructions for setting it up, and make sure to globally expose currentWallet.
* [react-native-ethereum-kit](https://modules.deco.network/chris/react-native-ethereum-kit)
* a global rnEthKitConfig variable appropriately set
* a global currentWallet variable appropriately set

Once you have the above prerequesties, simply show the Browser component using your application's navigator.  Your user can then navigate to cryptokitties or whatever.

Please report bugs as issues [here](https://modules.deco.network/chris/react-native-dapp-browser)