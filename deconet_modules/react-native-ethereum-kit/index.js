export default class RNEthereumKit {
  static init (apiKey) {
    global.rnEthKitConfig = {
      apiKey: apiKey,
      sdkdHost: 'https://sdk-d.herokuapp.com',
      sdkdStaticHost: 'https://s3.amazonaws.com/static.sdkd.co',
      moduleConfig: {},
      unsignedApiKey: this._extractDataFromApiKey(apiKey)
    }
  }

  static _extractDataFromApiKey (apiKey) {
    return apiKey.split('.')[1]
  }
}
