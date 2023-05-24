'use strict';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Toast from "react-native-toast-message";

const window = Dimensions.get('window');
//https://farmasiapp.com/wp-json/wc/v3/products?per_page=100&lang=en&consumer_key=ck_fca0b5560e3e43f7446a4f0925b17b9ce849796e&consumer_secret=cs_51b23a671cd0cba5c66e47ea81caae285262d512
//https://farmasi.ps/wp-json/wc/v3/products?per_page=100&lang=en&consumer_key=ck_a4f28b66cf8d0649a042bbdac69ce714bf2f0aaf&consumer_secret=cs_ddf7e431906f27526effa838d6d9e81c06c68800
// https://farmasiapp.com/wp-json/wc/v3/customers/4
// /wp-json/wc/v3/orders/?customer=4
//https://farmasiapp.com/wp-json/digits/v1/login_user?user=85850404887@farmasiapp.com&password=8237&consumer_key=ck_fca0b5560e3e43f7446a4f0925b17b9ce849796e&consumer_secret=cs_51b23a671cd0cba5c66e47ea81caae285262d512
const defines = {
    screenWidth: window.width,
    screenHeight: window.height,
    backgroundColor: "white",
    drawerWidth: 300,
    backLightPrimary: '#fe5d67',
    backDarkPrimary: "#ff004d",
    site: "https://farmasiapp.com/",
    keys2: "consumer_key=ck_a4f28b66cf8d0649a042bbdac69ce714bf2f0aaf&consumer_secret=cs_ddf7e431906f27526effa838d6d9e81c06c68800",
    keys1: "consumer_key=ck_fca0b5560e3e43f7446a4f0925b17b9ce849796e&consumer_secret=cs_51b23a671cd0cba5c66e47ea81caae285262d512",
}


const showProductsByCategories = (product, nav, allProducts, mainViewRef, setQuantityCart, isHome, addToList, allLists) => {
    let thisOnList = [];
    if (allLists) {
        thisOnList = allLists.filter(x => product.id == x.id && x.type == 'cart');
    }
    let imageSrc = product.images_src;
    imageSrc = imageSrc.replace(/\r?\n|\r/g, '');
    // let imageSrcSplit = product.images_src.split(".");
    // imageSrcSplit.forEach((val, index)=>{
    //     if (index === imageSrcSplit.length-1){
    //         imageSrc += "-300x300."+imageSrcSplit[imageSrcSplit.length-1];
    //     }else if(index === imageSrcSplit.length-2){
    //         imageSrc += imageSrcSplit[index];
    //     }else{
    //         imageSrc += imageSrcSplit[index]+".";
    //     }
    // })
    // console.log(allLists)
    return (
        <TouchableOpacity style={{
            width: (window.width / (product.numColumns ? product.numColumns : 3) - 24),
            position: 'relative',
            borderStyle: 'solid',
            paddingBottom: isHome ? 32 : 64,
            marginTop: 12,
            borderWidth: 1,
            marginHorizontal: 10,
            backgroundColor: defines.backgroundColor,
            borderColor: 'rgba(0,0,0,0.05)',
            overflow: 'hidden'
        }}
                          onPress={() => {
                              if (mainViewRef) {
                                  mainViewRef.current?.scrollTo({
                                      y: 0,
                                      animated: true,
                                  });
                              }
                              if (setQuantityCart) {
                                  setQuantityCart(1);
                              }

                              nav.navigate("ProductDetails", {productID: product.id});
                          }}
        >
            {product.regular_price != product.price ? <View style={{
                backgroundColor: defines.backDarkPrimary,
                position: 'absolute',
                width: 35,
                display: 'flex',
                height: 35,
                zIndex: 1,
                left: 8,
                padding: 4,
                borderRadius: 20,
                textAlign: 'center',
                overflow: 'hidden',
                top: 8,
                alignItems: 'center',
                justifyContent: 'center',
            }}><Text style={{
                fontSize: 11,
                color: 'white',
                fontWeight: 'bold'
            }}>-{Math.round(100 - (product.price * 100) / (product.regular_price))}%</Text></View> : null}

                <Image alt={"Unstable Internet"} style={{
                    width: (window.width / (product.numColumns ? product.numColumns : 3)) - 24,
                    height: (window.width / (product.numColumns ? product.numColumns : 3)) - 24,
                    overflow: 'hidden'
                }}
                                 onError={error => {
                                     alert("Loading Image error: "+error.nativeEvent.error);
                                 }}
                                 source={{
                                     uri: imageSrc
                                 }}/>

            <Text style={{
                maxWidth: '100%',
                color: "gray",
                marginHorizontal: 8,
                overflow: 'hidden',
                fontSize: 12,
                textAlign: 'center',
                fontWeight: '400'
            }}>{product.name}</Text>
            <View style={[styles.flex, {marginHorizontal: 8, display: 'none'}]}>
                <Image source={require('./assets/icon_star.png')} style={{width: 14, height: 14}}/>
                <Text style={{color: 'gray', fontSize: 14, fontWeight: '300'}}>{product.average_rating}/5
                    ({product.rating_count}) ● {product.total_sales} sold</Text>
            </View>
            <View style={[styles.flex, {
                position: 'absolute', bottom: isHome ? 0 : 32, left: 0, right: 0, height: 32,
                marginHorizontal: 8, marginBottom: 4, alignItems: 'center', justifyContent: 'center'
            }]}>
                <Text style={[styles.flex, {
                    marginHorizontal: 2,
                    marginTop: 4,
                    color: defines.backDarkPrimary,
                    fontSize: 16,
                    fontWeight: 'bold',
                    textAlign: 'center'
                }]}>
                    ₪{(product.price.toString()).includes(".") ? product.price : product.price + ".00"}
                </Text>
                {product.price !== product.regular_price ? (<Text style={[styles.flex, {
                    marginHorizontal: 2,
                    marginTop: 4,
                    color: 'gray',
                    textAlign: 'center',
                    textDecorationLine: 'line-through',
                    textDecorationStyle: 'solid',
                    fontSize: 11,
                    fontWeight: 'normal'
                }]}>
                    ₪{(product.regular_price.toString()).includes(".") ? product.regular_price : product.regular_price + ".00"}
                </Text>) : null}
            </View>
            <TouchableOpacity
                style={[styles.flex, {
                    justifyContent: 'center',
                    alignSelf: 'center',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    width: "100%", padding: 8,
                    display: isHome ? "none" : undefined,
                    height: 32,
                    backgroundColor: thisOnList.length > 0 ? "gray" : defines.backDarkPrimary
                }]}
                onPress={() => {
                    if (thisOnList.length > 0) {
                        Toast.show({
                            type: 'error',
                            text2: `أضيف بالفعل إلى عربة التسوق!`,
                            topOffset: 70
                        });
                    } else {
                        addToList(product.id, 'cart', '1').then(result => {
                            if (result) {
                                Toast.show({
                                    type: 'success',
                                    //Successfully added to cart!
                                    text2: `تمت الإضافة إلى عربة التسوق بنجاح!`,
                                    topOffset: 70
                                });
                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error!',
                                    //Something went wrong!
                                    text2: `هناك خطأ ما!`,
                                    topOffset: 70
                                });
                            }
                        });
                    }
                }}
            >
                <Text style={{
                    color: defines.backgroundColor,
                    fontSize: 12
                }}>{thisOnList.length > 0 ? "Added to Cart" : "Add to Cart"}</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}


const apiBinder = (bind) => {
    if ((bind.toString()).includes("?")) {
        bind = bind + "&";
    } else {
        bind = bind + "?";
    }
    return defines.site + bind + defines.keys1 + "&timestamp=" + Date.now();
}
const styles = StyleSheet.create({
    centerView: {
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    },
    dimension16x9: {
        width: window.width,
        height: window.width * 9 / 16,
        resizeMode: 'stretch'
    },
    dimension1x1: {
        width: window.width,
        height: window.width,
        resizeMode: 'cover'
    },
    dot: {},
    shadowProp: {
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        zIndex: 998,
    },
    whiteBorderProps: {
        borderRadius: 1,
        borderColor: 'white',
        borderWidth: 1
    },
    smallIcon: {
        width: 25,
        height: 25,
        overflow: "hidden",
    },
    flex: {
        display: "flex", alignItems: 'center', flexDirection: 'row'
    },
    navTextItem: {
        fontSize: 12,
        fontWeight: "bold",
        color: defines.backLightPrimary,
        paddingStart: 8
    },
    wrapFlex: {
        display: "flex", alignItems: 'center', flexDirection: 'row'
    },
    navListItem: {
        padding: 16,
    },
    navIconItem: {},
    welcomeScreenView: {
        justifyContent: 'space-between', paddingVertical: 8,
        paddingHorizontal: 32
    },
    welcomeScreenText: {
        color: 'gray',
        fontSize: 16,
        fontStyle: 'italic',
        flexWrap: 'wrap',
        maxWidth: '70%'
    },
    welcomeScreenImage: {
        width: 50, height: 50, resizeMode: 'cover', overflow: 'hidden', borderRadius: 50 / 2
    }
});
export {
    styles,
    defines,
    window,
    apiBinder,
    showProductsByCategories
};
