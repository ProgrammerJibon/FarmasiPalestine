import React, { useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { showProductsByCategories } from "./Styles";

const ScreenSearch = (props) => {
  const [search, setSearch] = useState("");
  const styles = props.styles;
  const defines = props.defines;
  const window = props.window;

  let thisCatProducts = props.products.filter(o => {
    if (search == "") {
      return false;
    } else if (o.name.includes(search) || o.description.includes(search)) {
      console.log(o.description);
      return true;
    }
    return false;
  });

  const showProductsByCategory = item => {
    item.item.numColumns = 3;
    return showProductsByCategories(item.item, props.props.navigation, props.products, null, null, null, props.addToList, props.allList);
  };


  return (
    <View>
      <TextInput
        style={{
          width: window.width - 24,
          padding: 12,
          margin: 12,
          borderWidth: 1,
          borderColor: "red",
          color: defines.backDarkPrimary,
          textAlign: "right",
        }}
        onChangeText={setSearch}
        autoFocus={true}
        cursorColor={defines.backDarkPrimary}
        placeholderTextColor={"gray"}
        //Enter keyword
        placeholder={"أدخل الكلمة المفتاحية"}
      />
      <FlatList
        windowSize={3}
        data={thisCatProducts}
        numColumns={3}
        style={{
          margin: 12,
        }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        renderItem={showProductsByCategory} key={"5f"}
        ListHeaderComponent={() => {
          return <Text
            style={{ color: "black", textAlign: "right", fontSize: 25, fontWeight: "bold", margin: 12 }}>{
            (thisCatProducts.length > 0 ? " نتيجة البحث عن " + search : (search != "" ? " وجدت شيئا ل " + search : "اكتب للبحث"))
          }</Text>;
        }}
      />
    </View>
  );
};

export default ScreenSearch;
