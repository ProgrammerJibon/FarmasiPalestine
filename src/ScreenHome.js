import React, {useRef, useState} from 'react';
import {FlatList, Image, RefreshControl, Text, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {showProductsByCategories} from "./Styles";

let stopSlider = false;
let activeImage = 0;
let catShownX = 0;
const ScreenHome = (props) => {
    const styles = props.styles;
    const defines = props.defines;
    const window = props.window;

    const [refreshing, setRefreshing] = useState(false);
    const views = ['header', 'welcome', 'categories', 'products'];
    const [productsShown, setProductsShown] = useState(30);
    let ScrollViewSlider = useRef();
    const nav = props.nav;
    const showProductsByCategory = item => {
        item.item.numColumns = 3;
        return showProductsByCategories(item.item, nav, props.products, null, null, true)
    }
    // const HeaderViewX = () => {
    //     const images = [
    //         require('./assets/image_slider_0.jpg'),
    //         // require('./assets/image_slider_1.png'),
    //         // require('./assets/image_slider_2.png'),
    //         // require('./assets/image_slider_3.png'),
    //         // require('./assets/image_slider_4.png'),
    //         // require('./assets/image_slider_5.png'),
    //         // require('./assets/image_slider_0.jpg')
    //     ]
    //     const slide = () => {
    //         if (ScrollViewSlider && ScrollViewSlider.scrollTo && !stopSlider){
    //             if (activeImage === images.length){
    //                 activeImage = 0;
    //                 ScrollViewSlider.scrollTo({ x: (activeImage)*window.width, y: 0, animated: false })
    //                 setTimeout(()=>{
    //                     slide();
    //                 }, 1000)
    //             }else{
    //                 activeImage ++;
    //                 ScrollViewSlider.scrollTo({ x: (activeImage)*window.width, y: 0, animated: true })
    //                 setTimeout(()=>{
    //                     slide();
    //                 }, 3000)
    //             }
    //         }else{
    //             setTimeout(()=>{
    //                 slide();
    //             }, 3000)
    //         }
    //     }
    //     slide();
    //     const toggleStopSlider = (stop, contentOffsetX, layoutMeasurementWidth) =>{
    //         if (contentOffsetX && layoutMeasurementWidth){
    //             activeImage = Math.ceil(contentOffsetX / layoutMeasurementWidth);
    //             // console.log(activeImage)
    //         }
    //         stopSlider = stop;
    //     }
    //     const onChange = (nativeEvent)=>{
    //         if (nativeEvent){
    //             activeImage = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    //         }
    //     }
    //     return (
    //         <View style={[styles.dimension1x1]}>
    //             <ScrollView
    //                 ref={rf=>{ScrollViewSlider=rf}}
    //                 onScroll={({nativeEvent})=>onChange(nativeEvent)}
    //                 pagingEnabled={true}
    //                 horizontal={true}
    //                 style={styles.dimension1x1}
    //                 onTouchStart={()=>{toggleStopSlider(true)}}
    //                 onScrollEndDrag={(e )=>{toggleStopSlider(false, e.nativeEvent.contentOffset.x, e.nativeEvent.layoutMeasurement.width);}}
    //                 onTouchEnd={()=>{toggleStopSlider(false)}}
    //             >
    //                 {
    //                     images.map((e, index)=>
    //                         <Image
    //                             key={index}
    //                                style={[styles.dimension1x1]}
    //                                source={images[index]}
    //                                />
    //                     )
    //                 }
    //             </ScrollView>
    //             <View></View>
    //         </View>
    //     )
    // }
    const WelcomeViewX = () => {
        return false;
        return (
            <View style={{backgroundColor: '#f8f8f8'}}>
                <View style={[styles.flex, styles.welcomeScreenView]}>
                    <Text style={[styles.welcomeScreenText]}>Delivery service available</Text>
                    <Image style={[styles.welcomeScreenImage]} source={require('./assets/sample_image_1.jpg')}/>
                </View>
                <View style={[styles.flex, styles.welcomeScreenView]}>
                    <Image style={[styles.welcomeScreenImage]} source={require('./assets/sample_image_2.jpg')}/>
                    <Text style={[styles.welcomeScreenText]}>Products with all certificates of the Ministry of
                        Health</Text>
                </View>
                <View style={[styles.flex, styles.welcomeScreenView]}>
                    <Text style={[styles.welcomeScreenText]}>High Quality Products</Text>
                    <Image style={[styles.welcomeScreenImage]} source={require('./assets/sample_image_3.jpg')}/>
                </View>
            </View>
        )
    }

    const showCategories = (item) => {
        if (item.item.count > 0) {
            let imageSrc = item.item.image_src;
            // if (item.item.image_src){
            //     let imageSrcSplit = item.item.image_src.split(".");
            //     imageSrcSplit.forEach((val, index)=>{
            //         if (index === imageSrcSplit.length-1){
            //             imageSrc += "-150x150."+imageSrcSplit[imageSrcSplit.length-1];
            //         }else if(index === imageSrcSplit.length-2){
            //             imageSrc += imageSrcSplit[index];
            //         }else{
            //             imageSrc += imageSrcSplit[index]+".";
            //         }
            //     })
            // }else{
            //     imageSrc = item.item.image_src;
            // }
            return (
                <TouchableOpacity
                    onPress={() => {
                        nav.navigate("ProductByCategories", {categoryID: item.item.id});
                    }}
                >
                    <Image style={{
                        width: (window.width / 3) - 16,
                        height: (window.width / 3) - 16,
                        marginHorizontal: 8,
                        marginBottom: 4,
                        marginTop: 8
                    }}
                           source={{
                               uri: imageSrc
                           }}/>
                    <Text style={{
                        color: "black",
                        marginHorizontal: 8,
                        marginBottom: 8,
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>{item.item.name}</Text>
                </TouchableOpacity>
            );
        }


    }
    props.products.forEach(item => {
        // console.log(item.price, item.regular_price, item.price-item.regular_price)
    })


    const showCatProducts = (item) => {
        // console.log(item.index)
        let thisCatProducts = props.products.filter(o => o.categories_id_0 == item.item.id || o.categories_id_1 == item.item.id || o.categories_id_2 == item.item.id);
        // console.log("\n\n\n", item.item.id, item.item.name, item.item.count, thisCatProducts.length);
        return (
            <View style={{flex: 1, marginHorizontal: 8}}>
                <View style={[styles.flex, {
                    justifyContent: 'space-between',
                    marginHorizontal: 8,
                    alignItems: 'center',
                    marginTop: 50,
                }]}>
                    <TouchableOpacity
                        onPress={event => {
                            nav.navigate("ProductByCategories", {categoryID: item.item.id})
                        }}
                    >
                        <Text style={{color: "red", marginLeft: 0, fontFamily: 'sans-serif'}}>View All</Text>
                    </TouchableOpacity>
                    <Text style={{
                        color: 'black',
                        textAlign: 'right',
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}>{item.item.name}</Text>
                </View>
                <View style={{
                    borderStyle: 'solid',
                    display: 'none',
                    marginHorizontal: '20%',
                    borderBottomColor: 'rgba(0,0,0,0.07)',
                    borderBottomWidth: 1
                }}></View>
                <FlatList
                    windowSize={1.5}
                    data={thisCatProducts.slice(0, 8)} showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false} horizontal pagingEnabled={false}
                    renderItem={showProductsByCategory} key={item => item.item.id}/>
                {
                    item.index === 2 ? (
                        <TouchableOpacity onPress={() => nav.navigate("ProductDetails", {productID: 17158})}
                                          style={{margin: 8, marginTop: 32}}>
                            <Image style={[{
                                width: window.width - 32,
                                height: window.width * 9 / 16 - 32,
                                resizeMode: 'stretch'
                            }]} source={require('./assets/image_slider_6.png')}/>
                        </TouchableOpacity>) : null
                }
            </View>
        )

    }


    function showViews(item) {
        if (item.item === 'products') {
            return (
                <View>
                    <Text style={{color: 'grey', display: 'none', padding: 8, fontSize: 20, textAlign: 'center'}}>Recent
                        Products</Text>
                    <FlatList
                        windowSize={1.5}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={props.categories} renderItem={showCatProducts} key={item => item.id}/>
                    {/*{props.products.length + 10 > productsShown? (<Text style={{color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: 16, marginBottom: 64}}>Loading...</Text>) : <Text style={{color: 'green', fontWeight: 'bold', textAlign: 'center', margin: 16}}>End of result</Text>}*/}
                </View>
            )
        } else if (item.item == 'offersDiscount') {
            let thisDiscountProducts = props.products.filter(o => o.regular_price - o.price != 0);
            return (
                <View style={{marginHorizontal: 8, marginTop: 32}}>
                    <Text style={{
                        color: 'black',
                        marginHorizontal: 8,
                        textAlign: 'right',
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}>العروض والخصومات</Text>
                    <FlatList
                        windowSize={1.5}
                        data={thisDiscountProducts} horizontal showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false} pagingEnabled={false} renderItem={showProductsByCategory}
                        key={item => item.id}/>
                    {/*{props.products.length + 10 > productsShown? (<Text style={{color: 'red', fontWeight: 'bold', textAlign: 'center', marginTop: 16, marginBottom: 64}}>Loading...</Text>) : <Text style={{color: 'green', fontWeight: 'bold', textAlign: 'center', margin: 16}}>End of result</Text>}*/}
                </View>
            )
        } else if (item.item === 'categories') {
            return (
                <View style={{marginTop: 16}}>
                    <Text style={{color: 'grey', display: 'none', padding: 8, fontSize: 20, textAlign: 'center'}}>Categories
                        You May Like</Text>
                    <FlatList windowSize={1.5} horizontal={true} data={props.categories} pagingEnabled={false}
                              showsHorizontalScrollIndicator={false}
                              showsVerticalScrollIndicator={false} renderItem={showCategories} key={3}/>
                </View>
            );
        } else if (item.item === 'header') {
            return (
                <TouchableHighlight onPress={() => nav.navigate("ProductByCategories", {categoryID: 323})}>
                    <Image style={[{width: window.width, height: window.width, resizeMode: 'cover'}]}
                           source={require('./assets/image_slider_0.jpg')}/>
                </TouchableHighlight>
            );
        } else if (item.item === 'welcome') {
            return WelcomeViewX();
        } else if (item.item === 'extraCats') {
            return (
                <View>
                    <TouchableOpacity onPress={() => nav.navigate("ProductByCategories", {categoryID: 322})}
                                      style={{marginHorizontal: 16, marginTop: 32}}>
                        <Image style={[{
                            width: window.width - 32,
                            height: window.width * 9 / 16 - 32,
                            resizeMode: 'stretch'
                        }]} source={require('./assets/image_slider_7.png')}/>
                    </TouchableOpacity>
                    <View style={[styles.flex, {marginHorizontal: 16, marginTop: 8}]}>
                        <TouchableOpacity onPress={() => nav.navigate("ProductByCategories", {categoryID: 316})}
                                          style={{}}>
                            <Image style={[{
                                width: window.width / 2 - 16,
                                height: window.width / 2.5 * 9 / 16,
                                resizeMode: 'stretch'
                            }]} source={require('./assets/image_slider_8.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => nav.navigate("ProductByCategories", {categoryID: 313})}
                                          style={{}}>
                            <Image style={[{
                                width: window.width / 2 - 16,
                                height: window.width / 2.5 * 9 / 16,
                                resizeMode: 'stretch'
                            }]} source={require('./assets/image_slider_10.png')}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => nav.navigate("ProductByCategories", {categoryID: 314})}
                                      style={{marginHorizontal: 16, marginTop: 8}}>
                        <Image style={[{
                            width: window.width - 32,
                            height: window.width * 12 / 16 - 32,
                            resizeMode: 'stretch'
                        }]} source={require('./assets/image_slider_9.png')}/>
                    </TouchableOpacity>
                    {/*<Image style={[{marginHorizontal: 16, marginTop: 8, marginBottom: 32, width: window.width - 32, height: window.width * 9 /22 - 32, resizeMode: 'stretch'}]} source={require('./assets/image_slider_11.png')}/>*/}
                </View>
            );
        }
    }

    let items = ['header', 'welcome', 'categories', 'products', 'extraCats']; //'offersDiscount',
    return (
        <View style={{backgroundColor: 'white'}}>
            <FlatList refreshControl={<RefreshControl
                colors={["#ff0000", "#d53c6b"]}
                refreshing={props.refreshing}
                updateCellsBatchingPeriod={1000}
                initialNumToRender={1}
                windowSize={1.5}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{backgroundColor: 'white'}}
                onRefresh={() => {
                    props.setRefreshing(true);
                    props.reload();
                }}/>} data={items} renderItem={showViews}/>
        </View>
    );
};

export default ScreenHome;
