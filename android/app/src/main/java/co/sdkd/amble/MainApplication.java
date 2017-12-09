package co.sdkd.amble;

import android.app.Application;
import android.os.Build;
import android.webkit.WebView;

import com.facebook.react.ReactApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.common.build.ReactBuildConfig;
import com.react.rnspinkit.RNSpinkitPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.peel.react.rnos.RNOSModule;
import com.bitgo.randombytes.RandomBytesPackage;
import com.oblador.keychain.KeychainPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new LinearGradientPackage(),
            new RNSpinkitPackage(),
            new VectorIconsPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RNOSModule(),
            new RandomBytesPackage(),
            new KeychainPackage(),
            new RCTCameraPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
//    System.out.println("build version is " + Build.VERSION.SDK_INT + " and kitkat build is " + Build.VERSION_CODES.KITKAT);
//    System.out.println("ReactBuildConfig.debug is " + ReactBuildConfig.DEBUG);
    SoLoader.init(this, /* native exopackage */ false);
    WebView.setWebContentsDebuggingEnabled(true);
  }
}
