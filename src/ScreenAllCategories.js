import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";

const ScreenAllCategories = (props) => {
    const styles = props.styles;
    const defines = props.defines;
    const window = props.window;

    if (props.categories[props.categories.length - 1].id !== -1) {
        props.categories.push({
            _links_self_href: "",
            count: 1,
            description: "عرض الكل",
            id: -1,
            image_src: "https://michaelq53.sg-host.com/wp-content/uploads/2022/08/all-1.png",
            name: "عرض الكل",
            parent_id: 0
        })
    }
    const showCategories = (category) => {
        if (category.count > 0) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        props.props.navigation.navigate("ProductByCategories", {categoryID: category.id});
                    }}
                >
                    <Image style={{
                        width: (window.width / 2) - 16,
                        height: (window.width / 2) - 16,
                        marginHorizontal: 8,
                        marginBottom: 4,
                        marginTop: 8
                    }}
                           source={{
                               uri: category.image_src
                           }}/>
                    <Text style={{
                        color: "black",
                        marginHorizontal: 8,
                        marginBottom: 8,
                        textAlign: 'center',
                        fontWeight: 'bold'
                    }}>{category.name}</Text>
                </TouchableOpacity>
            );
        }


    }

    return (
        <View>
            <FlatList windowSize={1.5} numColumns={2} data={props.categories} pagingEnabled={false}
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false} renderItem={item => showCategories(item.item)} key={1}/>
        </View>
    );
};

export default ScreenAllCategories;
