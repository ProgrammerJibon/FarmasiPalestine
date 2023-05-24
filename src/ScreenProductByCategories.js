import React from "react";
import { FlatList, Text, View } from "react-native";
import { showProductsByCategories } from "./Styles";

const ScreenProductByCategories = (props) => {
    let categoryID = props.props.route.params.categoryID;
    const styles = props.styles;
    const defines = props.defines;
    const window = props.window;

    let thisCategory = props.categories.filter(item => item.id == categoryID);

    let thisCatProducts = props.products.filter(o => o.categories_id_0 == categoryID || o.categories_id_1 == categoryID || o.categories_id_2 == categoryID || categoryID == -1);

    const showProductsByCategory = item => {
        item.item.numColumns = 2;
        return showProductsByCategories(item.item, props.props.navigation, props.products, null, null, null, props.addToList, props.allList)
    }


    return (
        <View style={{backgroundColor: defines.backgroundColor, flex: 1}}>
            <FlatList
                windowSize={3}
                data={thisCatProducts}
                numColumns={2}
                initialNumToRender={8}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={16}
                style={{
                    margin: 12,
                }}
                renderItem={showProductsByCategory} key={"5f"}
                ListHeaderComponent={() => {
                    return <Text style={{
                        color: 'black',
                        textAlign: 'right',
                        fontSize: 25,
                        fontWeight: 'bold',
                        margin: 12
                    }}>{thisCategory[0] ? thisCategory[0].name : ""}</Text>;
                }}
            />
        </View>
    )
};

export default ScreenProductByCategories;
