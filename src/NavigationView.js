import React from 'react';
import {BackHandler, Image, Linking, ScrollView, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {Gravatar} from 'react-native-gravatar';

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
                    }}>{props.userDisplayName ? props.userDisplayName : "GUEST USER"}</Text>
                </View>
            </View>

            <ScrollView style={{width: "100%"}}>
                <View style={{width: defines.drawerWidth}}>
                    {navItem(require("./assets/icon_home.png"), "Home", e => {
                        props.navigation.navigate("Home");
                    })}
                    {props.userDisplayName ? navItem(require("./assets/icon_profile.png"), "Account", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/my-account/"});
                    }, e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/wp-admin"});
                    }) : null}
                    {props.userDisplayName ? navItem(require("./assets/icon_order.png"), "Orders", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/my-account/orders/"});
                        // props.navigation.navigate("ScreenOrders");
                    }, e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/wp-admin"});
                    }) : null}
                    {navItem(require("./assets/icon_hamburger.png"), "Categories", e => {
                        props.navigation.navigate("AllCategories");
                    })}
                    {navItem(require("./assets/icon_shopping_cart.png"), "WishList", e => {
                        props.navigation.navigate('ScreenWishlist')
                    })}
                    {navItem(require("./assets/icon_shopping.png"), "Cart", e => {
                        props.navigation.navigate('ScreenCartList')
                    })}
                    {props.userDisplayName ? navItem(require("./assets/icon_order.png"), "Orders", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/my-account/orders/"});
                    }) : null}

                    {navItem(require("./assets/icon_who_are_we.png"), "Who are we", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d9%85%d9%86-%d9%86%d8%ad%d9%86/"});
                    })}
                    {navItem(require("./assets/icon_about_us.png"), "About Farmasi", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%b9%d9%86-%d9%81%d8%a7%d8%b1%d8%b3%d9%8a/"});
                    })}
                    {navItem(require("./assets/icon_company_terms_and_conditions.png"), "Company's policy", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%b3%d9%8a%d8%a7%d8%b3%d8%a9-%d8%a7%d9%84%d8%a5%d8%b1%d8%ac%d8%a7%d8%b9-2/"});
                    })}
                    {navItem(require("./assets/icon_company_insurance_policy.png"), "Privacy policy", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%b3%d9%8a%d8%a7%d8%b3%d8%a9-%d8%a7%d9%84%d8%a5%d8%b1%d8%ac%d8%a7%d8%b9/"});
                    })}
                    {navItem(require("./assets/icon_operator.png"), "Call Us", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%a7%d8%aa%d8%b5%d9%84-%d8%a8%d9%86%d8%a7/"});
                    })}
                    {navItem(require("./assets/icon_terms_conditions.png"), "Terms & Conditions", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/%d8%b3%d9%8a%d8%a7%d8%b3%d8%a9-%d8%a7%d9%84%d8%a5%d8%b1%d8%ac%d8%a7%d8%b9-2/"});
                    })}
                    {navItem(require("./assets/icon_info.png"), "App info", e => {
                        props.navigation.navigate('loadLink');
                    })}
                    {props.userDisplayName ? null : navItem(require("./assets/icon_login.png"), "Login", e => {
                        props.navigation.navigate("WebView", {url: "https://michaelq53.sg-host.com/?login=true&back=home&page=1"});
                    }, e => {
                        props.navigation.navigate("WebView", {
                            url: "https://michaelq53.sg-host.com/wp-admin",
                            fromCheckout: true
                        });
                    })}
                    {!props.userDisplayName ? null : navItem(require("./assets/icon_logout.png"), "Logout", e => {
                        RCTNetworking.clearCookies();
                        BackHandler.exitApp();
                    })}
                    <TouchableHighlight onPress={event => {
                        Linking.openURL("https://g.dev/programmerjibon");
                    }}>
                        <Text style={{color: 'gray', fontSize: 10, textAlign: 'center', padding: 16}}>Developed by <Text
                            style={{fontWeight: 'bold'}}>ProgrammerJibon</Text></Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        </View>
    );
};

export default NavigationView;
