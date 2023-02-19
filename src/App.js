import React, {useMemo, useState, useRef} from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {NavigationContainer} from "@react-navigation/native";
import ScreenHome from "./ScreenHome";
import NavigationView from "./NavigationView";
import {apiBinder, defines, styles, window} from "./Styles";
import {Image, SafeAreaView, StatusBar, Animated, Text, TouchableOpacity, View} from "react-native";
import * as database from "./database";
import * as RootNavigation from './RootNavigation';
import loadJson from "./loadJson";
import {useNetInfo} from "@react-native-community/netinfo";
import ScreenProductDetails from "./ScreenProductDetails";
import BrowserWebView from "./BrowserWebView";
import ScreenAllCategories from "./ScreenAllCategories";
import ScreenProductByCategories from "./ScreenProductByCategories";
import ScreenSearch from "./ScreenSearch";
import ScreenWishlist from "./ScreenWishlist";
import ScreenCartList from "./ScreenCartList";
import {TouchableRipple} from "react-native-paper";
import LoadLink from "./loadLink";
import Toast from "react-native-toast-message";
import ScreenCheckout from "./ScreenCheckout";
import ScreenOrders from "./ScreenOrders";

let once = true;
let once2 = true;
const App = () => {
    const Stack = useMemo(() => createNativeStackNavigator(), []);
    const [currentScreen, setCurrentScreen] = useState('Home');
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [mainScreen, setMainScreen] = useState('none');
    const [listDatabaseExists, setListDatabaseExists] = useState(false);
    const [listDatabase, setListDatabase] = useState([]);
    const [listDatabaseLoaded, setListDatabaseLoaded] = useState(false);
    const [productDatabaseExists, setProductDatabaseExists] = useState(false);
    const [categoriesDatabaseExists, setCategoriesDatabaseExists] = useState(false);
    const [productsFromDatabase, setProductsFromDatabase] = useState([]);
    const [productsFromDatabaseLoaded, setProductsFromDatabaseLoaded] = useState(false);
    const [categoriesFromDatabase, setCategoriesFromDatabase] = useState([]);
    const [categoriesFromDatabaseLoaded, setCategoriesFromDatabaseLoaded] = useState(false);
    const [userAddresses, setUserAddresses] = useState([]);
    const [userDisplayName, setUserDisplayName] = useState(null);
    const [userID, setUserID] = useState(null);
    const [userEmail, setUserEmail] = useState("حساب زائر");//GUEST USER
    // const offsetValue = useRef(new Animated.Value(0)).current;
    // const offsetValueNav = useRef(new Animated.Value(-40)).current;
    // const scaleValue = useRef(new Animated.Value(1)).current;
    // const embValue = 0.80;
    const netInfo = useNetInfo();
//https://michaelq53.sg-host.com/checkout/
//https://michaelq53.sg-host.com/?to_cart_react_native=18644:7,18648:2


    function syncUser() {
        return new Promise(resolve => {
            loadJson("https://michaelq53.sg-host.com/?userID=" + Date.now(), null).then(result => {
                if (result) {
                    if (result.data) {
                        if (result.data.display_name) {
                            setUserDisplayName(result.data.display_name);
                        } else {
                            setUserDisplayName(null);
                        }
                        if (result.data.user_email) {
                            setUserEmail(result.data.user_email);
                        } else {
                            setUserEmail(null);
                        }
                        if (result.data.ID) {
                            setUserID(result.data.ID);
                            resolve(result.data.ID);
                        } else {
                            setUserID(null);
                            resolve(null);
                        }
                    }
                }
            })
        })
    }


    const loadDatabase = () => {
        database.createTable("Categories", "id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(1024), description VARCHAR(999999), image_src VARCHAR(999999), count VARCHAR(1024), _links_self_href VARCHAR(999999), parent_id VARCHAR(1024)").then(result => {
            if (result) {
                database.createTable("Products", `id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(1024), permalink  VARCHAR(999999), status  VARCHAR(1024), featured  VARCHAR(1024), description  VARCHAR(999999), price  VARCHAR(1024), regular_price VARCHAR(1024), sale_price VARCHAR(1024), total_sales  VARCHAR(1024), on_sale  VARCHAR(1024), average_rating  VARCHAR(1024), rating_count  VARCHAR(1024), categories_id_0 VARCHAR(1024),categories_id_1 VARCHAR(1024),categories_id_2 VARCHAR(1024), images_src  VARCHAR(1024), related_ids  VARCHAR(1024), stock_status VARCHAR(1024), _links_self_href  VARCHAR(1024)`).then(result => {
                    if (result) {
                        database.createTable("Lists", "id INTEGER PRIMARY KEY AUTOINCREMENT, type VARCHAR(999999), quantity VARCHAR(1024)").then(result => {
                            if (result) {
                                once2 = true;
                                setListDatabaseExists(true);
                            } else {
                                console.log('Unable to create Categories');
                            }
                        })
                        setProductDatabaseExists(true);
                    } else {
                        console.log('Unable to create Products');
                    }
                })
                setCategoriesDatabaseExists(true);
            } else {
                console.log('Unable to create Categories');
            }
        })
    }


    const loadList = () => {
        database.getDataFromTable("Lists", "").then(res => {
            if (res) {
                setListDatabase(res);
                setListDatabaseLoaded(true);
            } else {
                setListDatabase([])
            }
        })
    }
    const deleteFromList = id => {
        return new Promise(resolve => {
            database.deleteFromTable("Lists", `id = (${id})`).then(res => {
                resolve(res);
                loadList();
            })
        })
    }


    const addToList = (product_id, type, quantity) => {
        return new Promise(resolve => {
            if (listDatabaseExists) {
                database.addToTable("Lists", `(id, type, quantity) VALUES ('${product_id}','${type}','${quantity}')`).then(result => {
                    if (result) {
                        loadList();
                        resolve(true);
                    }
                })
            } else {
                resolve(false);
            }
        })
    }

    const reloadProducts = (fromCategory = 0) => {
        let url = apiBinder("wp-json/wc/v3/products?per_page=100&lang=en");
        if (fromCategory) {
            url = apiBinder("wp-json/wc/v3/products?category=" + fromCategory + "&per_page=100&lang=en");
        }
        loadJson(url, null).then(result => {
            result.forEach((item, index) => {
                let imagesSrc = "";
                item.images.forEach(item => {
                    imagesSrc += item.src + "\n";
                });
                database.addToTable("Products", `(id,name,permalink,status,featured,description,price,regular_price,sale_price,total_sales,on_sale,average_rating,rating_count,categories_id_0,categories_id_1,categories_id_2,images_src,related_ids,stock_status,_links_self_href) VALUES ('${item.id}','${item.name}','${item.permalink}','${item.status}','${item.featured}','${(item.short_description).replace(/'/g, "")}','${item.price}','${item.regular_price}','${item.sale_price}','${item.total_sales}','${item.on_sale}','${item.average_rating}','${item.rating_count}','${item.categories[0].id}','${item.categories[1] ? item.categories[1].id : ""}','${item.categories[2] ? item.categories[2].id : ""}}','${imagesSrc}','${item.related_ids}','${item.stock_status}','${item._links.self[0].href}')`).then(res => {
                    if (result.length - 1 === index) {
                        loadProducts();
                    }
                    if (!res) {
                        console.log("false: ", item.id, item.name);
                    }
                    once2 = true;
                });

            });
        })
    }

    const reloadCategories = () => {
        const url = apiBinder("wp-json/wc/v2/products/categories?per_page=100&orderby=id&order=desc");
        loadJson(url, null).then(result => {
            result.forEach(item => {
                if (item.count > 0 && item.image != null) {
                    database.addToTable("Categories", `(id, name, description, image_src, count, _links_self_href, parent_id) VALUES ('${item.id}','${item.name}', '${item.description}','${item.image.src}','${item.count}','${item._links.self[0].href}','${item.parent}')`).then(result => {
                        once2 = true;
                        if (!result) {
                            console.log("false: ", item.id, item.name);
                        }
                    })
                }
            });
        })
    }

    const loadProducts = () => {
        database.getDataFromTable("Products", ``).then(result => {
            if (result.length > 0) {
                setProductsFromDatabase(result);
                setProductsFromDatabaseLoaded(true);
                setTimeout(e => {
                    setMainScreen(undefined);
                    setRefreshing(false);
                }, 500)
                once2 = true;
            } else {
                if (netInfo.isInternetReachable) {
                    reloadProducts();
                } else {
                    alert("Unable to load products\nCheck your Internet Connection");
                }
            }
        });
    }

    const loadCategories = () => {
        database.getDataFromTable("Categories", ``).then(result => {
            if (result.length > 0) {
                setCategoriesFromDatabase(result);
                setCategoriesFromDatabaseLoaded(true);
            } else {
                if (netInfo.isInternetReachable) {
                    reloadCategories();
                } else {
                    alert("Unable to load products\nCheck your Internet Connection");
                }
            }
        });
    }

    // check database available or not
    if (once2) {
        once2 = false;
        if (!productDatabaseExists && !categoriesDatabaseExists) {
            loadDatabase();
        } else {
            if (!categoriesFromDatabaseLoaded) {
                loadCategories();
            }
            if (!listDatabaseLoaded) {
                loadList();
            }
            if (!productsFromDatabaseLoaded) {
                loadProducts();
            }
        }
    }

    if (once) {
        once = false;
        syncUser().then(id => {
            if (id) {
                loadJson(apiBinder("wp-json/wc/v3/customers/" + id)).then(res => {
                    setTimeout(e => {
                        once = true
                    }, 3000);
                    if (res) {
                        setUserAddresses(res);
                    }
                })
            } else {
                setTimeout(e => {
                    once = true
                }, 3000);
            }
        });
    }


    const realodAll = () => {
        if (netInfo.isInternetReachable) {
            loadDatabase();
            loadList();
            reloadCategories();
            reloadProducts();
        } else {
            alert("أنت غير متصل بالإنترنت");// Your not connected over internet
        }
    }


    // const [offsetValue, setOffsetValue] = useState(0);
    const offsetValue = useRef(new Animated.Value(0)).current;
    const toggleDrawer = () => {
        if (drawerOpened) {
            setDrawerOpened(false);
            // setOffsetValue(0)
        } else {
            setDrawerOpened(true);
            // setOffsetValue(defines.drawerWidth * -1);
        }
        Animated.timing(offsetValue, {
            toValue: drawerOpened ? 0 : defines.drawerWidth * -1,
            duration: 500,
            useNativeDriver: true
        }).start();
        // Animated.timing(offsetValue, {
        //     toValue: drawerOpened ? 0 : defines.drawerWidth - (defines.drawerWidth * (1 - embValue)),
        //     duration: 500,
        //     useNativeDriver: true
        // }).start();
        // Animated.timing(offsetValueNav, {
        //     toValue: drawerOpened ? -40 : defines.drawerWidth, // - (defines.drawerWidth * (1 - embValue))
        //     duration: 500,
        //     useNativeDriver: true
        // }).start();
        // Animated.timing(scaleValue, {
        //     toValue: drawerOpened ? 1 : embValue,
        //     duration: 150,
        //     useNativeDriver: true
        // }).start();
    }
    const NavDrawer = () => {
        return <NavigationView navigation={RootNavigation} userDisplayName={userDisplayName} userEmail={userEmail}
                               visible={drawerOpened} toggleDrawer={toggleDrawer} setVisible={setDrawerOpened}
                               styles={styles} defines={defines} window={window}/>
    }

    /*let webView = useRef();
    return(
        <TouchableOpacity style={{
            flex: 1
        }}
        onPress={e=>{
            webView.current.reload()
            loadLink("https://www.jibon.io/test/testCookies.php", null).then(result=>{
                alert(result)
            })
        }}
        >
            <WebView
                ref={webView}
                pullToRefreshEnabled={true}
                source={{
                    uri: "https://www.jibon.io/test/testCookies.php"
                }}
                style={{
                    flex: 1,
                }}
            />
        </TouchableOpacity>
    )*/
    return (
        <SafeAreaView style={{display: mainScreen, flex: 1, position: 'relative', backgroundColor: 'white'}}>
            <Animated.View style={{
                width: defines.drawerWidth,
                flex: 1,
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: defines.drawerWidth * -1,
                zIndex: 999,
                transform: [
                    // {translateX: offsetValueNav}
                    {translateX: offsetValue}
                ]
            }}>
                {NavDrawer()}
                <TouchableOpacity style={{position: 'absolute', left: -40, top: 25, opacity: drawerOpened ? 1 : 0}}
                                  onPress={toggleDrawer}>
                    <Image source={require('./assets/icon_left_arrow.png')}
                           style={{tintColor: 'white', width: 32, height: 32, transform: [{rotateZ: '180deg'}]}}/>
                </TouchableOpacity>
            </Animated.View>
            <View style={[{flex: 1}]}>
                <NavigationContainer ref={RootNavigation.navigationRef} onStateChange={(state) => {
                    setCurrentScreen(RootNavigation.navigationRef.current.getCurrentRoute().name)
                }}>
                    <StatusBar
                        backgroundColor={defines.backDarkPrimary}
                        animated={true}
                    />
                    <View style={[styles.flex, {
                        width: "100%",
                        backgroundColor: defines.backDarkPrimary,
                        height: 64,
                        justifyContent: 'space-between'
                    }]}>
                        <TouchableOpacity onPress={() => RootNavigation.navigate('ScreenCartList')}
                                          style={{padding: 16, position: 'relative'}}>
                            <Text style={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                backgroundColor: 'white',
                                borderRadius: 10,
                                color: defines.backDarkPrimary,
                                padding: 4,
                                zIndex: 1,
                                fontSize: 12
                            }}>{listDatabase.filter(y => y.type == 'cart').length}</Text>
                            <Image source={require('./assets/icon_bag.png')}
                                   style={[styles.smallIcon, {tintColor: defines.backgroundColor}]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => RootNavigation.navigate('Home')} style={{padding: 16}}>
                            <Image source={require('./assets/logo.png')} style={[{
                                tintColor: defines.backgroundColor,
                                width: 200,
                                height: 25,
                                margin: 'auto'
                            }]}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleDrawer} style={{padding: 16}}>
                            <Image
                                source={drawerOpened ? require('./assets/icon_left_arrow.png') : require('./assets/icon_more.png')}
                                style={[styles.smallIcon, {tintColor: defines.backgroundColor}]}/>
                        </TouchableOpacity>
                    </View>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false,
                            presentation: 'modal',
                        }}
                    >
                        <Stack.Screen name="Home">
                            {props => <ScreenHome reload={realodAll} styles={styles} defines={defines} window={window}
                                                  nav={RootNavigation} reloadFromCat={reloadProducts}
                                                  refreshing={refreshing} setRefreshing={setRefreshing}
                                                  products={productsFromDatabase} categories={categoriesFromDatabase}
                                                  toggleDrawer={toggleDrawer}/>}
                        </Stack.Screen>
                        <Stack.Screen name="ProductDetails">
                            {props => <ScreenProductDetails props={props} deleteFromList={deleteFromList}
                                                            addToList={addToList} allList={listDatabase}
                                                            products={productsFromDatabase}
                                                            categories={categoriesFromDatabase} styles={styles}
                                                            defines={defines} window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="loadLink">
                            {props => <LoadLink props={props} addToList={addToList} allList={listDatabase}
                                                products={productsFromDatabase} categories={categoriesFromDatabase}
                                                styles={styles} defines={defines} window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="AllCategories">
                            {props => <ScreenAllCategories props={props} addToList={addToList} allList={listDatabase}
                                                           products={productsFromDatabase}
                                                           categories={categoriesFromDatabase} styles={styles}
                                                           defines={defines} window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="ScreenOrders">
                            {props => <ScreenOrders props={props} addToList={addToList} allList={listDatabase}
                                                    products={productsFromDatabase} categories={categoriesFromDatabase}
                                                    styles={styles} defines={defines} window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="ProductByCategories">
                            {props => <ScreenProductByCategories props={props} addToList={addToList}
                                                                 allList={listDatabase} products={productsFromDatabase}
                                                                 categories={categoriesFromDatabase} styles={styles}
                                                                 defines={defines} window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="ScreenSearch">
                            {props => <ScreenSearch props={props} addToList={addToList} allList={listDatabase}
                                                    products={productsFromDatabase} categories={categoriesFromDatabase}
                                                    styles={styles} defines={defines} window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="ScreenWishlist">
                            {props => <ScreenWishlist props={props} nav={RootNavigation} deleteFromList={deleteFromList}
                                                      addToList={addToList} allList={listDatabase}
                                                      products={productsFromDatabase} styles={styles} defines={defines}
                                                      window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="ScreenCartList">
                            {props => <ScreenCartList props={props} nav={RootNavigation} deleteFromList={deleteFromList}
                                                      addToList={addToList} allList={listDatabase}
                                                      products={productsFromDatabase} styles={styles} defines={defines}
                                                      window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="CheckoutScreen">
                            {props => <ScreenCheckout props={props} deleteFromList={deleteFromList}
                                                      userAddresses={userAddresses} userID={userID}
                                                      userEmail={userEmail} nav={RootNavigation} addToList={addToList}
                                                      allList={listDatabase} products={productsFromDatabase}
                                                      styles={styles} defines={defines} window={window}/>}
                        </Stack.Screen>
                        <Stack.Screen name="WebView">
                            {props => <BrowserWebView props={props} syncUser={syncUser} userID={userID} styles={styles}
                                                      defines={defines} window={window} navigation={RootNavigation}
                                                      setAddresses={setUserAddresses}/>}
                        </Stack.Screen>
                    </Stack.Navigator>
                    <View style={[styles.flex, {
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        width: defines.screenWidth,
                        backgroundColor: defines.backgroundColor
                    }]}>
                        <TouchableOpacity style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 50
                        }} onPress={() => RootNavigation.navigate('ScreenWishlist')}>
                            <Image
                                style={[styles.smallIcon, {tintColor: currentScreen == "ScreenWishlist" ? defines.backDarkPrimary : 'gray'}]}
                                source={require('./assets/icon_heart.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 50
                        }} onPress={() => RootNavigation.navigate('ScreenSearch')}>
                            <Image
                                style={[styles.smallIcon, {tintColor: currentScreen == "ScreenSearch" ? defines.backDarkPrimary : 'gray'}]}
                                source={require('./assets/icon_search.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 50
                        }} onPress={() => RootNavigation.navigate('AllCategories')}>
                            <Image
                                style={[styles.smallIcon, {tintColor: currentScreen == 'AllCategories' || currentScreen == "ProductByCategories" ? defines.backDarkPrimary : 'gray'}]}
                                source={require('./assets/icon_categories.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 50
                        }} onPress={() => RootNavigation.navigate('Home')}>
                            <Image
                                style={[styles.smallIcon, {tintColor: currentScreen == "Home" ? defines.backDarkPrimary : 'gray'}]}
                                source={require('./assets/icon_home.png')}/>
                        </TouchableOpacity>
                    </View>
                    <TouchableRipple
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            display: drawerOpened ? undefined : 'none',
                            backgroundColor: 'rgba(0,0,0,0.50)'

                        }}
                        onPress={toggleDrawer}
                    ><View/></TouchableRipple>
                </NavigationContainer>
            </View>
            <Toast/>
        </SafeAreaView>

    );
};

export default App;
