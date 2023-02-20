import React, {useState} from "react";
import {WebView} from "react-native-webview";
import {Bar} from "react-native-progress";
import {Provider} from "react-native-paper";
import {apiBinder} from "./Styles";
import {BackHandler, View} from "react-native";
import loadJson from "./loadJson";


// let isValidHttpUrl = (str) => {
//     let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
//         '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
//         '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
//         '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
//         '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
//         '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
//     return !!pattern.test(str);
// }

let once = true;
const BrowserWebView = (props) => {


    let params = props.props.route.params;
    const styles = props.styles;
    const defines = props.defines;
    const window = props.window;
    const navigation = props.navigation.navigationRef.current;
    const [webView, setWebView] = useState(null);
    const [webViewCanGoBack, setWebViewCanGoBack] = useState(false);
    const [changinView, setChanginView] = useState(false);
    // const [link, setLink] = useState(params.url);
    const [loading, setLoading] = useState(false);


    const webViewGOBack = () => {
        if (webViewCanGoBack) {
            webView.goBack();
        } else {
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        }
        return true;
    }
    const funReSync = e => {
        setLoading(true)
        if (params.fromCheckout) {
            props.syncUser().then(id => {
                if (id) {
                    setChanginView(true);
                    loadJson(apiBinder("wp-json/wc/v3/customers/" + id)).then(res => {
                        if (res) {
                            setLoading(true);
                            props.setAddresses(res);
                            props.navigation.navigate("ScreenCartList");
                        } else {
                            setLoading(false)
                        }
                    })
                } else {
                    setLoading(false)
                }
            })
        }
    }
    if (!loading) {
        funReSync();
    }


    BackHandler.addEventListener('hardwareBackPress', (e) => {
        return webViewGOBack();
    });

    const [progress, setProgress] = useState(0);
    return (
        <Provider style={[styles.container]}>
            <View
                style={{
                    height: "100%",
                    width: '100%',
                    position: 'absolute',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    display: changinView ? undefined : 'none'
                }}
            />
            <Bar width={null} indeterminate={changinView} unfilledColor={changinView ? 'white' : undefined}
                 color={defines.backDarkPrimary} style={{zIndex: 2}} progress={progress} borderRadius={0}
                 borderWidth={0}/>
            <WebView
                ref={setWebView}
                onNavigationStateChange={(e) => {
                    console.log(e.url)
                    if (e.url == "https://michaelq53.sg-host.com/") {
                        if (params.fromCheckout) {
                            props.navigation.navigate("ScreenCartList");
                        } else {
                            props.navigation.navigate("Home");
                        }
                    }
                    if (params.fromCheckout){
                        setLoading(false);
                    }
                    setWebViewCanGoBack(e.canGoBack);
                }}
                userAgent={"Android"}
                onScroll={event => {
                    webView.requestFocus();
                }}
                source={{uri: params.url}}
                style={[styles.wevView,]}
                onError={(e) => {
                    e.preventDefault();
                }}
                onLoadProgress={e => {
                    setProgress(e.nativeEvent.progress);
                }}
            ></WebView>
        </Provider>
    );
};

export default BrowserWebView;
