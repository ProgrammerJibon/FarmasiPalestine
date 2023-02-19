import React, {useRef, useState} from 'react';
import {FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {showProductsByCategories} from "./Styles";
import RenderHTML from "react-native-render-html";
import Toast from "react-native-toast-message";

const ScreenProductDetails = (props) => {
    let productID = props.props.route.params.productID;
    const styles = props.styles;
    const defines = props.defines;
    const window = props.window;
    let mainViewRef = useRef();
    let product = props.products.filter(item => (item.id == productID))[0];
    let thisCatProducts = [];
    if (props.products) {
        thisCatProducts = props.products.filter(x => {
            let bool = false;
            product.related_ids.toString().split(",").forEach(o => {
                if (o == x.id) {
                    bool = true;
                }
            })
            return bool;
        });
    }
    let thisOnList = [];
    if (props.allList) {
        thisOnList = props.allList.filter(x => product.id == x.id);
    }

    const [quantityCart, setQuantityCart] = useState(thisOnList.length > 0 ? thisOnList[0].quantity : 1);

    const showProductsByCategory = item => {
        item.item.numColumns = 3;
        return showProductsByCategories(item.item, props.props.navigation, props.products, mainViewRef, setQuantityCart, true, props.addToList, props.allList)
    }

    return (<View style={{flex: 1}}>
        <TouchableOpacity
            style={{
                overflow: 'visible',
                position: 'absolute',
                right: 0,
                top: 0,
                zIndex: 1,
                padding: 16
            }}
            onPress={e => props.props.navigation.canGoBack() ? props.props.navigation.goBack() : false}
        >
            <Image
                source={require('./assets/icon_left_arrow.png')}
                style={{
                    width: 25,
                    height: 25,
                    tintColor: 'rgba(0,0,0,0.7)',
                    transform: [{rotateZ: "180deg"}]
                }}
            />
        </TouchableOpacity>
        <ScrollView ref={mainViewRef} style={{
            flex: 1,
            backgroundColor: defines.backgroundColor
        }}
                    focusable={true}
                    onScroll={event => {
                        if (quantityCart < 1) {
                            setQuantityCart(1);
                        }
                    }}
        >
            {product.regular_price !== product.price ? <View style={{
                backgroundColor: defines.backDarkPrimary,
                position: 'absolute',
                width: 60,
                display: 'flex',
                height: 60,
                zIndex: 1,
                left: 8,
                padding: 4,
                borderRadius: 30,
                textAlign: 'center',
                overflow: 'hidden',
                top: 8,
                alignItems: 'center',
                justifyContent: 'center',
            }}><Text style={{
                fontSize: 17,
                color: 'white',
                fontWeight: 'bold'
            }}>-{Math.round(100 - (product.price * 100) / (product.regular_price))}%</Text></View> : null}
            <Image style={{
                width: window.width,
                height: window.width,
                overflow: 'hidden'
            }}
                   source={{
                       uri: product.images_src
                   }}/>
            <View style={[styles.flex, {justifyContent: 'space-between', alignItems: 'flex-start'}]}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        height: 50,
                        overflow: 'hidden',
                        marginHorizontal: 8,
                        marginVertical: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    onPress={event => {
                        thisOnList.length > 0 ? thisOnList[0].type === "wish" ? props.deleteFromList(thisOnList[0].id).then(res => {
                            Toast.show({
                                type: 'success',
                                text1: 'Wait!',
                                //Removed from wishlist!
                                text2: `تمت إزالته من قائمة الرغبات!`,
                                topOffset: 70
                            });
                        }) : props.addToList(productID, 'wish', quantityCart).then(res => {
                            Toast.show({
                                type: 'success',
                                text1: 'Wait!',
                                //Added to wishlist!
                                text2: `أضيف لقائمة الأماني!`,
                                topOffset: 70
                            });
                        }) : props.addToList(productID, 'wish', quantityCart).then(res => {
                            Toast.show({
                                type: 'success',
                                text1: 'Wait!',
                                //Added to wishlist!
                                text2: `أضيف لقائمة الأماني!`,
                                topOffset: 70
                            });
                        })
                    }
                    }>
                    <Image
                        source={require('./assets/icon_heart.png')}
                        style={{
                            width: 30,
                            height: 30,
                            tintColor: thisOnList.length > 0 ? thisOnList[0].type === "wish" ? defines.backDarkPrimary : 'black' : 'gray'
                        }}
                    />
                </TouchableOpacity>
                <Text style={{
                    maxWidth: '100%',
                    color: "black",
                    marginHorizontal: 8,
                    marginVertical: 16,
                    overflow: 'hidden',
                    fontSize: 20,
                    textAlign: 'right',
                    fontWeight: 'bold',
                }}>{product.name}</Text>
            </View>
            <View style={[styles.flex, {marginHorizontal: 8, display: 'none'}]}>
                <Image source={require('./assets/icon_star.png')} style={{width: 14, height: 14}}/>
                <Text style={{color: 'gray', fontSize: 14, fontWeight: '300'}}>{product.average_rating}/5
                    ({product.rating_count}) ● {product.total_sales} sold</Text>
            </View>
            <View style={[{
                display: 'flex',
                flexDirection: 'row-reverse',
                marginHorizontal: 8,
                marginBottom: 4,
                alignItems: 'center',
                justifyContent: 'flex-start'
            }]}>
                <Text style={[{
                    marginHorizontal: 8,
                    marginTop: 4,
                    color: defines.backDarkPrimary,
                    fontSize: 20,
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
                    fontSize: 14,
                    fontWeight: 'normal'
                }]}>
                    ₪{(product.regular_price.toString()).includes(".") ? product.regular_price : product.regular_price + ".00"}
                </Text>) : null}
            </View>
            <View style={{
                display: undefined
            }}>

                <TouchableOpacity
                    style={{display: 'none'}}
                    onPress={event => {
                        props.addToList(productID, 'wish', quantityCart).then(res => res ? alert("Added to wishlist!") : alert("Something went wrong!"))
                    }
                    }>
                    <Text style={{color: defines.backDarkPrimary, textAlign: 'right', padding: 16}}>Add to
                        wishlist</Text>
                </TouchableOpacity>
                <View style={[styles.flex, {
                    justifyContent: 'space-evenly', alignItems: 'center', marginVertical: 32,

                }]}>
                    <TouchableOpacity style={[styles.flex, {
                        justifyContent: 'center',
                        alignSelf: 'center',
                        height: 40,
                        paddingHorizontal: 32,
                        borderRadius: 32,
                        overflow: 'hidden',
                        backgroundColor: defines.backDarkPrimary
                    }]}
                                      onPress={e => {
                                          props.addToList(productID, 'cart', quantityCart).then(res => res ? alert("Added to cart!") : alert("Something went wrong!"))
                                      }}
                    >
                        <Text style={{color: defines.backgroundColor}}>
                            {/*Add to Cart*/}
                            {"أضف إلى السلة"}
                        </Text>
                    </TouchableOpacity>
                    <View style={[styles.flex, {
                        width: 'auto',
                        height: 40,
                        justifyContent: 'center',
                        alignSelf: 'baseline',
                        alignItems: 'center',
                        borderStyle: 'solid',
                        borderColor: defines.backDarkPrimary,
                        borderWidth: 1,
                        overflow: 'hidden',
                        borderRadius: 32
                    }]}>
                        <TouchableOpacity
                            onPress={() => {
                                setQuantityCart(prevCartNum => {
                                    return prevCartNum + 1;
                                })
                            }}
                            style={{
                                display: 'flex',
                                borderRightColor: defines.backDarkPrimary,
                                borderRightWidth: 1,
                                backgroundColor: defines.backgroundColor,
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <Text style={{color: defines.backDarkPrimary, fontSize: 24, textAlign: 'center',}}>+</Text>
                        </TouchableOpacity>
                        <TextInput
                            onChangeText={text => {
                                if (text == "" || Math.round(text) < 0) {
                                    text = 0;
                                }
                                setQuantityCart(Math.round(text))
                            }}
                            onBlur={e => {
                                console.log(e.nativeEvent)
                            }}
                            style={{
                                width: 32,
                                color: 'gray',
                                textAlign: 'center',
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                                borderTopColor: defines.backDarkPrimary,
                                borderBottomColor: defines.backDarkPrimary
                            }}
                            value={"" + quantityCart}
                            keyboardType='numeric'/>
                        <TouchableOpacity
                            onPress={() => {
                                setQuantityCart(prevCartNum => {
                                    if (prevCartNum <= 1) {
                                        return 1;
                                    }
                                    return prevCartNum - 1;
                                })
                            }}
                            style={{
                                display: 'flex',
                                borderLeftColor: defines.backDarkPrimary,
                                borderLeftWidth: 1,
                                backgroundColor: defines.backgroundColor,
                                width: 40,
                                height: 40,
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                            <Text style={{color: defines.backDarkPrimary, fontSize: 24, textAlign: 'center',}}>-</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={{marginHorizontal: 16, marginVertical: 8}}>
                <RenderHTML contentWidth={window.width}
                            enableExperimentalRtl={true}
                            baseStyle={{
                                color: 'black',
                                textAlign: 'right',
                                fontWeight: 'bold'
                            }}
                            listStyleType='disc'
                            tagsStyles={{
                                ol: {
                                    listStyleType: 'none',
                                },
                                ul: {
                                    listStyleType: 'none',
                                },
                                li: {
                                    width: window.width - 64,
                                    color: 'gray'
                                },
                                h1: {fontSize: "32px"},
                                h2: {fontSize: "26px"},
                                h3: {fontSize: "22px"},
                                h4: {fontSize: "20px"},
                                h5: {fontSize: "18px"},
                                h6: {fontSize: "16px"},
                            }}
                            source={{
                                html: `<span dir="RTL" lang="ar" >${product.description}</span>`
                            }}/>
            </View>
            {thisCatProducts.length > 0 ? <View style={{
                padding: 16
            }}>
                <Text style={{
                    color: defines.backDarkPrimary,
                    fontSize: 15,
                    textAlign: 'right'
                }}>
                    {/*Related Products*/}
                    {"منتجات ذات صله"}
                </Text>
                <FlatList
                    windowSize={1}
                    nestedScrollEnabled={true}
                    data={thisCatProducts} showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false} horizontal pagingEnabled={false}
                    renderItem={showProductsByCategory} key={item => product.id}/>
            </View> : null}
        </ScrollView>
    </View>);
};

export default ScreenProductDetails;
