import React, { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from "react-native";

const ScreenWishlist = (props) => {
  const styles = props.styles;
  const defines = props.defines;
  const window = props.window;
  let allListRes = [];
  const [quantities, setQuantities] = useState([]);
  const [changingData, setChangingData] = useState(-1);
  if (props.allList && props.products) {
    allListRes = props.products.filter(x => {
      let bool = false;
      props.allList.filter(y => {
        if (x.id == y.id && y.type == "wish") {
          x.quantity = y.quantity;
          bool = true;
        }
      });
      return bool;
    });
  }
  console.log(changingData);
  const showListsItemsWishlist = item => {
    if (!quantities[item.index]) {
      setQuantities(prevState => {
        prevState[item.index] = item.item.quantity;
        return prevState;
      });
    }

    return <View
      elevation={3}
      pointerEvents={changingData == item.index ? "none" : "auto"}
      style={{
        height: 120,
        width: window.width - 32,
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: defines.backgroundColor,
        overflow: "hidden",
        borderStyle: "solid",
        borderColor: "#fefefe",
        borderWidth: 1,
        borderRadius: 6,
        position: "relative",
        flexDirection: "row-reverse",
        alignItems: "center",
        opacity: changingData == item.index ? 0.8 : 1,
      }}>
      <TouchableOpacity
        onPress={event => {
          props.nav.navigate("ProductDetails", { productID: item.item.id });
        }}
      >
        <Image source={{ uri: item.item.images_src }} style={{ width: 120, height: 120 }} />
      </TouchableOpacity>
      <View style={{ marginHorizontal: 8, flex: 1, alignItems: "flex-end" }}>
        <Text style={{ color: "red" }}>{item.item.name}</Text>
        <View style={[styles.flex, { alignItems: "flex-end", flexDirection: "row-reverse" }]}>
          <Text style={{ color: "red", fontSize: 15, fontWeight: "bold" }}>₪{item.item.price}</Text>
          <Text style={{
            color: "gray",
            fontSize: 10,
            marginHorizontal: 4,
            textDecorationLine: "line-through",
            textDecorationStyle: "solid",
            display: item.item.price - item.item.regular_price != 0 ? undefined : "none",
          }}>₪{item.item.regular_price}</Text>
        </View>
      </View>
      <View style={[{
        justifyContent: "center", alignItems: "center",

      }]}>
        <View style={[styles.flex, {
          width: "auto",
          justifyContent: "flex-end",
          overflow: "hidden",
          marginTop: 8,
          alignItems: "center",
        }]}>
          <TouchableOpacity
            onPress={() => {
              setChangingData(item.index);
              const text = Math.round(quantities[item.index]) + 1;
              props.addToList(item.item.id, "wish", text).then(res => {
                setQuantities(prevState => {
                  prevState[item.index] = text;
                  return prevState;
                });
                setChangingData(-1);
              });
            }}
            style={{
              display: "flex",
              backgroundColor: defines.backgroundColor,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Text style={{
              color: defines.backDarkPrimary,
              fontSize: 24,
              textAlign: "center",
              fontWeight: "bold",
            }}>+</Text>
          </TouchableOpacity>
          <TextInput
            onChangeText={text => {
              setChangingData(item.index);
              if (text == "" || Math.round(text) < 0) {
                text = 0;
              }
              text = Math.round(text);
              props.addToList(item.item.id, "wish", text).then(res => {
                if (res) {
                  setQuantities(prevState => {
                    prevState[item.index] = text;
                    return prevState;
                  });
                  setChangingData(-1);
                }
              });
            }}
            editable={changingData < 0}
            style={{
              color: defines.backDarkPrimary,
              borderWidth: 1,
              margin: 0,
              borderColor: defines.backDarkPrimary,
              textAlign: "center",
              zIndex: 1,
              height: 30,
              padding: 0,
            }}
            value={"" + quantities[item.index]}
            keyboardType="numeric" />
          <TouchableOpacity
            onPress={() => {
              setChangingData(item.index);
              const text = Math.round(quantities[item.index]) - 1;
              props.addToList(item.item.id, "wish", text).then(res => {
                setQuantities(prevState => {
                  prevState[item.index] = text;
                  return prevState;
                });
                setChangingData(-1);
              });
            }}
            style={{
              display: "flex",
              backgroundColor: defines.backgroundColor,
              width: 40,
              height: 40,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <Text style={{
              color: defines.backDarkPrimary,
              fontSize: 24,
              textAlign: "center",
              fontWeight: "bold",
            }}>-</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.flex, {
          justifyContent: "center",
          alignSelf: "center",
          height: 25,
          paddingHorizontal: 8,
          borderRadius: 6,
          marginTop: 8,
          overflow: "hidden",
          backgroundColor: defines.backDarkPrimary,
        }]}
                          onPress={e => {
                            props.addToList(item.item.id, "cart", item.item.quantity).then(res => res ? alert("Added to cart!") : alert("Something went wrong!"));
                          }}
        >
          <Text style={{ color: defines.backgroundColor, fontSize: 12 }}>
            {/*Add to Cart*/}
            {"أضف إلى السلة"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.flex, {
          justifyContent: "center",
          alignSelf: "center",
          height: 40,
          paddingHorizontal: 8,
          borderRadius: 6,
          overflow: "hidden",
        }]}
                          onPress={e => {
                            props.deleteFromList(item.item.id);
                          }}
        >
          <Text style={{ color: defines.backDarkPrimary, fontSize: 10 }}>
            {/*Remove wishlist*/}
            {"حذف المنتج"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>;
  };
  return (
    <View
      style={{
        backgroundColor: defines.backgroundColor,
        flex: 1,
      }}
    >
      <FlatList
        windowSize={3}
        data={allListRes}
        initialNumToRender={8}
        onEndReachedThreshold={16}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={showListsItemsWishlist} key={"5f"}
        ListHeaderComponent={() => {
          return <Text
            style={{ color: "black", textAlign: "right", fontSize: 25, fontWeight: "bold", margin: 16 }}>
            {/*Wishlists*/}
            {"قوائم الامنيات"}
            ({allListRes.length})</Text>;
        }}
      />
    </View>
  );
};

export default ScreenWishlist;
