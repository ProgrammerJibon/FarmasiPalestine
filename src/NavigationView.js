import React from 'react';
import {BackHandler, Image, Linking, ScrollView, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {Gravatar} from 'react-native-gravatar';
import Toast from "react-native-toast-message";
const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')


const NavigationView = (props) => {
    const styles = props.styles;
    const defines = props.defines;
    const window = props.window;
    const navItem = (src, text, func, lon) => {
        return (
            <TouchableOpacity style={[styles.flex, styles.navListItem]} onPress={e => {
                if (func) {
                    func();
                }
                props.toggleDrawer();
            }} onLongPress={event => {
                if (lon) {
                    lon()
                }
                props.toggleDrawer();
            }}>
                <Image style={[styles.smallIcon]} source={src}/>
                <Text style={[styles.navTextItem]}>{text}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={{
            backgroundColor: defines.backgroundColor,
            width: "100%",
            height: '100%',
        }}>
            <View style={{backgroundColor: "#f8f8f8"}}>
                <View style={[styles.centerView, {padding: 64, width: defines.drawerWidth}]}>
                    <View style={{
                        width: 100,
                        height: 100,
                        overflow: 'hidden',
                        borderRadius: 100 / 2,
                        backgroundColor: defines.backgroundColor
                    }}>
                        {props.userEmail ? <Gravatar
                            style={{width: "100%", height: "100%"}}
                            options={{
                                email: props.userEmail,
                                parameters: {"size": "200", "d": "mm"},
                                secure: true
                            }}/> : (<Image style={{width: "100%", height: "100%"}}
                                           source={require('./assets/icon_profile.png')}/>)}
                    </View>

                    <Text style={{
                        fontSize: 12,
                        fontWeight: 'bold',
                        color: defines.backDarkPrimary,
                        padding: 8,
                        textTransform: 'capitalize'
                    }}>{/*GUEST USER*/}{props.userDisplayName ? props.userDisplayName : "???????? ????????"}</Text>
                </View>
            </View>

            <ScrollView style={{width: "100%"}}>
                <View style={{width: defines.drawerWidth}}>
                    {/*Home*/}
                    {navItem(require("./assets/icon_home.png"), "????????????????", e => {
                        props.navigation.navigate("Home");
                    })}
                    {/*Account*/}
                    {props.userDisplayName ? navItem(require("./assets/icon_profile.png"), "????????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/my-account/"});
                    }) : null}
                    {/*Orders*/}
                    {props.userDisplayName ? navItem(require("./assets/icon_order.png"), "??????????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/my-account/orders/"});
                        // props.navigation.navigate("ScreenOrders");
                    }) : null}
                    {/*Categories*/}
                    {navItem(require("./assets/icon_hamburger.png"), "??????????????", e => {
                        props.navigation.navigate("AllCategories");
                    })}
                    {/*WishList*/}
                    {navItem(require("./assets/icon_shopping_cart.png"), "?????????? ??????????????", e => {
                        props.navigation.navigate('ScreenWishlist')
                    })}
                    {/*Cart*/}
                    {navItem(require("./assets/icon_shopping.png"), "???????? ????????????", e => {
                        props.navigation.navigate('ScreenCartList')
                    })}
                    {/*Orders*/}
                    {props.userDisplayName ? navItem(require("./assets/icon_order.png"), "??????????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/my-account/orders/"});
                    }) : null}
                    {/*Who are we*/}
                    {navItem(require("./assets/icon_who_are_we.png"), "???? ??????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d9%85%d9%86-%d9%86%d8%ad%d9%86/"});
                    })}
                    {/*About Farmasi*/}
                    {navItem(require("./assets/icon_about_us.png"), "?????? ??????????????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%b9%d9%86-%d9%81%d8%a7%d8%b1%d8%b3%d9%8a/"});
                    })}
                    {/*Company's policy*/}
                    {navItem(require("./assets/icon_company_terms_and_conditions.png"), "?????????? ????????????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%b3%d9%8a%d8%a7%d8%b3%d8%a9-%d8%a7%d9%84%d8%a5%d8%b1%d8%ac%d8%a7%d8%b9-2/"});
                    })}
                    {/*Privacy policy*/}
                    {navItem(require("./assets/icon_company_insurance_policy.png"), "?????????? ????????????????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%b3%d9%8a%d8%a7%d8%b3%d8%a9-%d8%a7%d9%84%d8%a5%d8%b1%d8%ac%d8%a7%d8%b9/"});
                    })}
                    {/*Call Us*/}
                    {navItem(require("./assets/icon_operator.png"), "???????? ??????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%a7%d8%aa%d8%b5%d9%84-%d8%a8%d9%86%d8%a7/"});
                    })}
                    {/*Terms & Conditions*/}
                    {/*navItem(require("./assets/icon_terms_conditions.png"), "???????????? ?? ????????????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%b3%d9%8a%d8%a7%d8%b3%d8%a9-%d8%a7%d9%84%d8%a5%d8%b1%d8%ac%d8%a7%d8%b9-2/"});
                    })*/}
                    {/*App info*/}
                    {/*navItem(require("./assets/icon_info.png"), "?????????????? ??????????????", e => {
                        props.navigation.navigate('loadLink');
                    })*/}
                    {/*Login*/}
                    {props.userDisplayName ? null : navItem(require("./assets/icon_login.png"), "?????????? ????????????", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/?login=true&back=home&page="+Date.now()});
                    }, e => {
                        props.navigation.navigate("WebView", {
                            url: "https://michaelq53.sg-host.com/wp-admin",
                            fromCheckout: true
                        });
                    })}
                    {/*Logout*/}
                    {!props.userDisplayName ? null : navItem(require("./assets/icon_logout.png"), "?????????? ????????", e => {
                        Toast.show({
                            type: 'error',
                            text1: 'Logging out!',
                            text2: "App will exit shortly...",
                            topOffset: 70,
                        })
                        setTimeout(e=>{
                            RCTNetworking.clearCookies();
                            BackHandler.exitApp();
                        }, 3000)
                    })}
                    {/*<TouchableHighlight onPress={event => {
                        Linking.openURL("https://g.dev/programmerjibon");
                    }}>
                        <Text style={{color: 'gray', fontSize: 10, textAlign: 'center', padding: 16}}>Developed by <Text
                            style={{fontWeight: 'bold'}}>ProgrammerJibon</Text></Text>
                    </TouchableHighlight>*/}
                </View>
            </ScrollView>
        </View>
    );
};

export default NavigationView;
