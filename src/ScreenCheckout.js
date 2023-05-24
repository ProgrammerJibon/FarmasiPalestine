import React, {useState} from 'react';
import {FlatList, Image, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import SelectDropdown from 'react-native-select-dropdown'
import Toast from "react-native-toast-message";
import WooCommerceAPI from "react-native-woocommerce-api";
import * as Progress from 'react-native-progress';
import loadJson from "./loadJson";


const ScreenCheckout = (props) => {
    const styles = props.styles;
    const defines = props.defines;
    const window = props.window;
  const [userID, setUserID] = useState(props.userID);
  const userEmail = props.userEmail;

  function generateRandom4DigitNumber() {
    // Generate a random number between 0 and 9999
    let randomNumber = Math.floor(Math.random() * 10000);

    // Pad the number with leading zeros if necessary
    let paddedNumber = randomNumber.toString().padStart(4, '0');

    return paddedNumber;
  }

    const WooCommerce = new WooCommerceAPI({
        url: 'https://farmasiapp.com/', // Your store URL
        ssl: true,
        consumerKey: 'ck_fca0b5560e3e43f7446a4f0925b17b9ce849796e', // Your consumer secret
        consumerSecret: 'cs_51b23a671cd0cba5c66e47ea81caae285262d512', // Your consumer secret
        wpAPI: true, // Enable the WP REST API integration
        version: 'wc/v3', // WooCommerce WP REST API version
        queryStringAuth: true
    });



  const registerUserWithPhone = async (phone, password) => {
    try {
      let userIdx = null;
      let mesRes = "";
      const response = await WooCommerce.post('customers', {
        username: phone,
        email: phone+"@farmasiapp.com",
        password: password,
        billing: {
          phone: phone
        }
      });

      if(response.id ){
        if(response.id){
          userIdx = response.id;
        }
      }

      if(response){
        if (response.message){
          mesRes= response.message;
        }
      }

      return {
        userId: userIdx,
        message: mesRes
      };
    } catch (error) {
      return {
        userId: userIdx,
        message: 'Failed to register user: ' + error.message,
      };
    }
  };


    let allListRes = [];
    let inTotal = 0;
    let onSubmitLists = [];
    if (props.allList && props.products) {
        allListRes = props.products.filter(x => {
            let bool = false;
            props.allList.filter(y => {
                if (x.id == y.id && y.type == 'cart') {
                    x.quantity = y.quantity;
                    inTotal += Math.round(x.price) * Math.round(x.quantity);
                    bool = true;
                    onSubmitLists.push({product_id: x.id, quantity: x.quantity});
                }
            });
            return bool;
        });
    }

    const billing_states = [
        {id: "PS01", name: "أريحا", states: ['الجفتلك', 'العوجا', 'ديون', 'فصايل', 'مرج نعمة']},
        {
            id: "PS02",
            name: "الخليل",
            states: ['ابو الغزلان ', 'ابو العسجا ', 'اذنا ', 'البرج ', 'الخليل', 'الرماضين', 'الريحية', 'لسموع', 'الشيوخ', 'الصرة', 'الظاهية ', 'الكرم', 'المجد', 'المورق', 'الهجرة', 'بني نعيم ', 'بيت اولا', 'بيت الروش التحتا', 'بيت الروش الفوقا', 'بيت امر ', 'بيت كاحل ', 'بيت عوا ', 'بيت مرسم ', 'ترقوميا', 'تفوح', 'حلحول', 'خاراس', 'دورا', 'دير العسل التحتا', 'دير العسل الفوقا', 'دير سامت ', 'سدة بيت عينون', 'سعير', 'سكا', 'صوريف', 'عبدة', 'كرزا ', 'مخيم العروب', 'مخيم الفوار ', 'نوبا يطا',]
        },
        {
            id: "PS04",
            name: "بيت لحم",
            states: ['ام سلمونة', 'ارطاس', 'الجبعة', 'الخضر', 'الخاص', 'الدوحة', 'السواحرة الشرقية', 'الشواوورة', 'العبيدية', 'العساكرة', 'المعصرة', 'المنشية', 'الولجة', 'بتير', 'بيت تعمر', 'بيت جالا', 'بيت ساحور', 'بيت فجار', 'بيت لحم', 'جناتا', 'جورة الشمعة', 'حوسان', 'خربة تقوع', 'دار صلاح ', 'زعترة', 'مخيم الدهيشة ', 'مخيم العزة ', 'مخيم بيت جبرين', 'مخيم عايدة', 'مراح رباح ', 'نحالين', 'وادي العرايس', 'وادي النيص ', 'وادي رحال ', 'وادي فوكين', 'الكركفة',]
        },
        {
            id: "PS05",
            name: "جنين",
            states: ['ألمانية', 'أم التوت', 'أم الريحان', 'أم دار', 'الجديدة', 'الجلمة', 'الخلجان', 'الرامة', 'الزاوية', 'الزبابدة', 'السيلة الحارثية', 'الطيبة', 'العطارة', 'العقبة', 'الفندقومية', 'الكفير', 'اللجون', 'المزار', 'المغير', 'المنشية', 'اليامون', 'برطعة', 'برقين', 'بيت قاد', 'بير الباشا', 'تعنك', 'تل الأسمر (اللجون)', 'تلفيت', 'جبع', 'جبل حريش', 'جربا', 'جلبون', 'جلقموس', 'جنزور', 'خربة الجوفة', 'خربة الرعدية', 'خربة السويطات', 'خربة المطلة', 'خربة خروبة ', 'خربة عبد الله اليونس ', 'دير أبو ضعيف', 'دير غزالة', 'رابا', 'رمانة', 'زبدة', 'زبوبا', 'زرعين', 'سيريس', 'سيلة الظهر', 'صانور', 'طورة الشرقية', 'طورة الغربية', 'ظهر المالح', 'عانين', 'عجة', 'عرانة', 'عربونة', 'عطارة', 'عين المنسي', 'فحمة', 'فراسين', 'فقوعة', 'قباطية', 'كفر دان', 'كفر راعي', 'كفر قود', 'كفير', 'كفيرت', 'مثلث الشهداء', 'مخيم جنين', 'مركة', 'مسلية', 'ميثلون', 'نزلة الشيخ زيد', 'هاشمية',]
        },
        {
            id: "PS06",
            name: "سلفيت",
            states: ['زيتا جماعين', 'اسكاكا', 'الزاوية', 'بديا', 'بروقين', 'حارس', 'خربة قيس', 'دير استيا', 'دير بلوط', 'رافات', 'سرطة', 'فرخة', 'قراوة بني حسان', 'قيرة', 'كفر الديك', 'كفل حارس', 'مردة', 'مسحة', 'ياسوف',]
        },
        {
            id: "PS07",
            name: "رام الله",
            states: ['أبو شخيدم', 'أبو قش', 'أم صفا', 'الجانية', 'الطيبة', 'الطيرة', 'اللبن الغربي', 'المدية', 'المزرعة الشرقية', 'المزرعة القبلية', 'المغير', 'بدرس', 'برقة', 'برهام', 'بلعين', 'بيت إللو', 'بيت ريما', 'بيت سيرا', 'بيت عور التحتا', 'بيت عور الفوقا', 'بيت لقيا', 'بيتين', 'بير نبالا', 'بيرزيت', 'ترمسعيا', 'جفنا', 'جلجيليا', 'جمالا', 'جيبيا', 'خربة أبو فلاح', 'خربثا المصباح', 'خربثا بني حارث', 'دورا القرع', 'دير أبو مشعل', 'دير إبزيع', 'دير السودان', 'دير جرير', 'دير دبوان', 'دير عمار', 'دير غسانة', 'دير قديس', 'دير نظام', 'راس كركر', 'رمون', 'رنتيس', 'سردا', 'سلواد', 'سنجل', 'شبتين', 'شقبا', 'صفا', 'عابود', 'عارورة', 'عبوين', 'عجول', 'عطارة', 'عين سينيا', 'عين عريك', 'عين قينيا', 'عين يبرود', 'قبيا', 'قراوة بني زيد', 'كفر عين', 'كفر مالك', 'كفر نعمة', 'كوبر', 'مزارع النوباني', 'نعلين', 'يبرود',]
        },
        {
            id: "PS08",
            name: "طولكرم",
            states: ['فرعون', 'شوفة', 'عزبة شوفة', 'عنبتا', 'كفر رمان', 'كفر اللبد', 'بيت ليد', 'بلعا', 'الحفاصي', 'رامين', 'سفارين', 'دير الغصون', 'المسقوفة', 'الجاروشية', 'علار', 'قفين', 'صيدا', 'عتيل', 'زيتا', 'باقة الشرقية', 'النزلة الغربية', 'النزلة الشرقية', 'النزلة الوسطى', 'نزلة أبو نار', 'نزلة عيسى', 'عكابا', 'رامين', 'كفر زيباد', 'كفر صور', 'كفر عبوش', 'كفر جمال', 'كور', 'الراس', 'جبارة', 'قاقون', 'عزبة الخلال',]
        },
        {
            id: "PS09",
            name: "قلقيلية",
            states: ['إماتين', 'الضبعة', 'الفندق', 'المدور', 'باقة الحطب', 'بيت أمين', 'جيت', 'جينصافوط', 'جيوس', 'حبلة', 'حجة', 'راس الطيرة', 'راس عطية', 'صير', 'عرب الرماضين الجنوبي', 'عرب الرماضين الشمالي', 'عزبة الأشقر', 'عزبة الطبيب', 'عزبة جلعود', 'عزبة سلمان', 'عزون', 'عزون عتمة', 'عسلة', 'فرعتا', 'فلامية', 'قلقيلية', 'كفر ثلث', 'كفر قدوم', 'كفر لاقف', 'وادي الرشا',]
        },
        {
            id: "PS10",
            name: "طوباس",
            states: ['إبزيق', 'العقبة', 'بردلة', 'تياسير', 'جباريس', 'حمرة', 'خربة الراس الأحمر', 'خربة المالح', 'خربة حمصة الفوقا', 'خربة عاطوف', 'راس الفارعة', 'سلحب', 'طوباس', 'طمون', 'طلوزة', 'عقابا', 'عين البيضا', 'كردلة', 'مخيم الفارعة', 'وادي الفارعة', 'وادي حمد',]
        },
        {
            id: "PS11",
            name: "نابلس",
            states: ['أودلا', 'أوصرينا', 'إجنسنيا', 'الباذان', 'الساوية', 'العقربانية', 'اللبن الشرقية', 'الناقورة', 'النصارية', 'برقة', 'بزاريا', 'بورين', 'بيت إمرين', 'بيت إيبا', 'بيت حسن', 'بيت دجن', 'بيت فوريك', 'بيت وزن', 'بيتا', 'تل', 'تلفيت', 'جالود', 'جماعين', 'جنيد', 'جوريش', 'حوارة', 'خربة عطية', 'دوما', 'دير الحطب', 'دير شرف', 'رفيديا', 'روجيب', 'زعترة ', 'زواتا', 'زيتا جماعين', 'سالم', 'سبسطية', 'عصيرة الشمالية', 'عصيرة القبلية', 'عقربا', 'عمورية', 'عورتا', 'عوريف', 'عين شبلي', 'عينبوس', 'فروش بيت دجن', 'قبلان', 'قريوت', 'قصرة', 'كفر قليل', 'لوزة', 'مادما', 'مجدل بني فاضل', 'نصف جبيل', 'ياصيد', 'يانون', 'يتما',]
        },
    ]
    const billing = props.userAddresses?props.userAddresses.billing:null;
    if (!billing){
        // return null;
    }
    const [first_name, setFirst_name] = useState(billing? billing.first_name : "");
    const [last_name, setLast_name] = useState(billing ? billing.last_name : "");
    const [streetName, setStreetName] = useState(billing ? billing.address_1 : "");
    const [state, setState] = useState(billing ? billing.state : "PS01");
    const [city, setCity] = useState(billing ? billing.city : 'الجفتلك');
    const [phone, setPhone] = useState(billing ? billing.phone : "");
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState(generateRandom4DigitNumber());
    const [token, setToken] = useState(null);
  // change your shipping charge here
    const [shippingCharge, setShippingCharge] = useState(20);
    if(inTotal < 150){
        if (shippingCharge == 0){
          setShippingCharge(20);
        }
    }else {
        if(shippingCharge != 0){
          setShippingCharge(0);
        }
    }

    let billingstatesfilter = billing_states.filter(value => value.id == state);
    const [billing_cities, setBilling_cities] = useState(billingstatesfilter[0].states);


    // props.nav.navigate("CheckoutScreen",{url: "https://farmasiapp.com/?to_cart_react_native="+res});

    return (
        <View>
            <ScrollView>
                <View style={[styles.flex, {paddingTop: 16}]}>
                    <TouchableOpacity style={[{width: window.width / 2,}]}>
                        <View
                            style={{
                                width: window.width / 2,
                                height: 5,
                                backgroundColor: step === 1 ? defines.backDarkPrimary : "gray",
                                position: 'absolute',
                                top: 17,
                                left: 0,
                                start: 0,
                                alignSelf: 'flex-start'
                            }}
                        />
                        <View style={{
                            borderWidth: 1,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                            borderColor: 'gray',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: 0,
                            margin: 0,
                            overflow: 'hidden',
                            borderRadius: 20
                        }}>
                            <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>1</Text>
                        </View>
                        <Text style={{color: 'black', alignSelf: 'center', fontSize: 16, fontWeight: 'bold'}}>تفاصيل
                            الفاتورة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[{width: window.width / 2,}]}>
                        <View
                            style={{
                                width: window.width / 2,
                                height: 5,
                                backgroundColor: step === 2 ? defines.backDarkPrimary : "gray",
                                position: 'absolute',
                                top: 17,
                                left: 0,
                                start: 0,
                                alignSelf: 'flex-start'
                            }}
                        />
                        <View style={{
                            borderWidth: 1,
                            alignSelf: 'center',
                            backgroundColor: 'white',
                            borderColor: 'gray',
                            width: 40,
                            height: 40,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: 0,
                            margin: 0,
                            overflow: 'hidden',
                            borderRadius: 20
                        }}>
                            <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>2</Text>
                        </View>
                        <Text
                            style={{color: 'black', alignSelf: 'center', fontSize: 16, fontWeight: 'bold'}}>طلبك</Text>
                    </TouchableOpacity>
                </View>
                <View style={{padding: 16, paddingBottom: 16, display: step === 1 ? undefined : 'none'}}>
                    <Text style={{textAlign: 'right', color: "black", marginVertical: 4}}>
                        {/*BILLING & SHIPPING*/}
                        {"الفواتير والشحن"}
                    </Text>
                    <TextInput
                        textAlign={'right'}
                        style={{
                            color: first_name.length > 3 ? "green" : 'red',
                            borderWidth: 1,
                            borderColor: first_name.length > 3 ? "green" : 'red',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginVertical: 8
                        }}
                        onChangeText={text => {
                            setFirst_name(text);
                        }}
                        placeholder={"الاسم الأول"}
                        placeholderTextColor={'gray'}
                        cursorColor={defines.backDarkPrimary}
                        value={first_name + ""}
                    />
                    <TextInput
                        textAlign={'right'}
                        style={{
                            color: last_name.length > 3 ? "green" : 'red',
                            borderWidth: 1,
                            borderColor: last_name.length > 3 ? "green" : 'red',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginVertical: 8
                        }}
                        onChangeText={text => {
                            setLast_name(text);
                        }}
                        placeholder={"اسم العائلة"}
                        placeholderTextColor={'gray'}
                        cursorColor={defines.backDarkPrimary}
                        value={last_name + ""}
                    />
                    <TextInput
                        textAlign={'right'}
                        style={{
                            color: streetName.length > 0 ? "green" : 'red',
                            borderWidth: 1,
                            borderColor: streetName.length > 3 ? "green" : 'red',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginVertical: 8
                        }}
                        onChangeText={text => {
                            setStreetName(text);
                        }}
                        placeholder={"عنوان الشارع"}
                        placeholderTextColor={'gray'}
                        cursorColor={defines.backDarkPrimary}
                        value={streetName + ""}
                    />
                    <Text style={{textAlign: 'right', color: "black", marginVertical: 4}}>
                        المحافظة
                    </Text>
                    <SelectDropdown
                        buttonStyle={{
                            color: state.length > 0 ? "green" : 'red',
                            borderWidth: 1,
                            borderColor: state.length > 0 ? "green" : 'red',
                            paddingHorizontal: 8,
                            marginVertical: 8,
                            width: '100%'
                        }}
                        renderCustomizedButtonChild={e => {
                            if (e) {
                                return <Text style={{color: state.length > 0 ? "green" : 'red'}}>{e.name}</Text>
                            } else {
                                const stateName = billing_states.filter(x => x.id == state)[0];
                                return (
                                    <View
                                        style={[styles.flex, {justifyContent: 'space-between', alignItems: 'center'}]}>
                                        <Image
                                            source={require('./assets/icon_left_arrow.png')}
                                            style={{
                                                height: 15,
                                                width: 15,
                                                marginHorizontal: 8,
                                                tintColor: state.length > 0 ? "green" : 'red',
                                                transform: [
                                                    {rotateZ: '-90deg'}
                                                ]
                                            }}
                                        />
                                        <Text
                                            style={{color: state.length > 0 ? "green" : 'red'}}>{stateName.name}</Text>
                                    </View>
                                )
                            }
                        }}
                        defaultButtonText={state != "" ? state : "Select province"}
                        buttonTextAfterSelection={e => {
                            return e.name;
                        }}
                        data={billing_states}
                        onSelect={(selectedItem, index) => {
                            setBilling_cities(billing_states[index].states)
                            setCity(billing_cities[0]);
                            setState(selectedItem.id);
                        }}
                        search={true}
                        renderCustomizedRowChild={(items, index) => {
                            return <Text style={{
                                color: defines.backDarkPrimary,
                                margin: 0,
                                paddingHorizontal: 16
                            }}>{items.name}</Text>;
                        }}
                        onChangeSearchInputText={() => {
                        }}/>
                    <Text style={{textAlign: 'right', color: "black", marginVertical: 4}}>
                        المدينة
                    </Text>
                    <SelectDropdown
                        buttonStyle={{
                            color: city.length > 0 ? "green" : 'red',
                            borderWidth: 1,
                            borderColor: city.length > 0 ? "green" : 'red',
                            paddingHorizontal: 8,
                            marginVertical: 8,
                            width: '100%'
                        }}
                        renderCustomizedButtonChild={e => {
                            return (
                                <View style={[styles.flex, {justifyContent: 'space-between', alignItems: 'center'}]}>
                                    <Image
                                        source={require('./assets/icon_left_arrow.png')}
                                        style={{
                                            height: 15,
                                            width: 15,
                                            marginHorizontal: 8,
                                            tintColor: state.length > 0 ? "green" : 'red',
                                            transform: [
                                                {rotateZ: '-90deg'}
                                            ]
                                        }}
                                    />
                                    <Text style={{
                                        color: city.length > 0 ? "green" : 'red',
                                        textAlign: 'right'
                                    }}>{city}</Text>
                                </View>
                            )
                        }}
                        buttonTextAfterSelection={e => {
                            return e;
                        }}
                        data={billing_cities}
                        onSelect={(selectedItem) => {
                            setCity(selectedItem);
                        }}
                        search={true}
                        renderCustomizedRowChild={(items, index) => {
                            return <Text style={{
                                color: defines.backDarkPrimary,
                                margin: 0,
                                paddingHorizontal: 16
                            }}>{items}</Text>;
                        }}
                        onChangeSearchInputText={() => {
                        }}/>
                    {/*<TextInput
                        textAlign={'right'}
                        style={{
                            color: city.length > 0?"green":'red',
                            borderWidth: 1,
                            borderColor: city.length > 0?"green":'red',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginVertical: 8
                        }}
                        onChangeText={text => {
                            setCity(text);
                        }}
                        placeholder={"المدينة"}
                        placeholderTextColor={'gray'}
                        cursorColor={defines.backDarkPrimary}
                        value={city+""}
                    />*/}
                    <Text style={{textAlign: 'right', color: "black", marginVertical: 4}}>
                        {/*Billing mobile phone number*/}
                        {"رقم الهاتف المتحرك الخاص بالفواتير"}
                    </Text>
                    <TextInput
                        textAlign={'right'}
                        style={{
                            color: phone.length > 8 ? "green" : 'red',
                            borderWidth: 1,
                            borderColor: phone.length > 8 ? "green" : 'red',
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            marginVertical: 8
                        }}
                        onChangeText={text => {
                            setPhone(text);
                        }}
                        keyboardType={'numeric'}
                        placeholderTextColor={'gray'}
                        cursorColor={defines.backDarkPrimary}
                        value={phone + ""}
                    />
                    <Text style={{textAlign: 'right', color: "black", marginVertical: 4}}>
                        الدولة / المنطقة
                    </Text>
                    <Text
                        style={{
                            textAlign: 'right',
                            color: 'gray',
                            borderWidth: 1,
                            borderColor: "gray",
                            paddingHorizontal: 8,
                            paddingVertical: 12,
                            marginVertical: 8,
                            display: 'none'

                        }}
                    >
                        Palestinian Territory
                    </Text>
                </View>
                <View style={{padding: 16, paddingBottom: 16, display: step === 2 || step === 3 ? undefined : 'none'}}>
                    <Text style={{textAlign: 'right', color: "black", marginVertical: 4}}>
                        {/*ORDER REVIEW*/}
                        {"مراجعة الطلب"}
                    </Text>
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                            borderRadius: 6,
                            padding: 16,
                            marginBottom: 32
                        }}
                    >
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View>
                                <Text style={{color: 'black', width: 70, textAlign: 'right'}}>
                                    {/*Subtotal*/}
                                    {"المبلغ الاجمالي"}
                                </Text>
                            </View>
                            <View>
                                <Text style={{color: 'black'}}>
                                    {/*Product*/}
                                    {"منتجات"}
                                </Text>
                            </View>
                        </View>
                        <FlatList data={allListRes} renderItem={object => {
                            return (<View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    paddingVertical: 8,
                                }}
                            >
                                <View>
                                    <Text style={{
                                        color: 'gray',
                                        textAlign: 'right',
                                        width: 70
                                    }}>{object.item.quantity * object.item.price}.00</Text>
                                </View>
                                <View>
                                    <Text style={{color: 'gray'}}>{object.item.quantity} x {object.item.name}</Text>
                                </View>
                            </View>);
                        }}/>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View>
                                <Text style={{color: 'black', width: 70, textAlign: 'right'}}>{shippingCharge}.00</Text>
                            </View>
                            <View>
                                <Text style={{color: 'black'}}>
                                    {/*Shipping*/}
                                    {"شحن"}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}
                        >
                            <View>
                                <Text style={{
                                    color: 'black',
                                    fontWeight: 'bold',
                                    width: 70,
                                    textAlign: 'right'
                                }}>₪{inTotal + shippingCharge}.00</Text>
                            </View>
                            <View>
                                <Text style={{color: 'black', fontWeight: 'bold'}}>
                                    {/*Total*/}
                                    {"المبلغ الإجمالي"}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/*TODO place order*/}
                    <TouchableOpacity>
                        <Text
                            onPress={e => {
                              // alert(phone+"\n"+password+"\n"+token);
                              // return false;
                                const data = {
                                    payment_method: "cod",
                                    payment_method_title: "Cash on delivery<br> (Unpaid)",
                                    set_paid: true,
                                    customer_id: userID,
                                    billing: {
                                        first_name: first_name,
                                        last_name: last_name,
                                        address_1: streetName,
                                        address_2: "",
                                        city: city,
                                        state: state,
                                        postcode: "",
                                        country: "PS",
                                        email: userEmail,
                                        phone: phone
                                    },
                                    shipping: {
                                        first_name: first_name,
                                        last_name: last_name,
                                        address_1: streetName,
                                        address_2: "",
                                        city: city,
                                        state: state,
                                        postcode: "",
                                        country: "PS"
                                    },
                                    line_items: onSubmitLists,
                                    shipping_lines: [
                                        {
                                            method_id: "flat_rate",
                                            method_title: "Flat Rate",
                                            total: shippingCharge + ""
                                        }
                                    ]
                                };
                                setStep(3);
                                WooCommerce.post("orders", data, {
                                  headers: {
                                    Accept: 'text/plain',
                                  }
                                })
                                    .then((response) => {
                                        if (response.id) {
                                            const dataxxx = {
                                                billing: {
                                                    first_name: first_name,
                                                    last_name: last_name,
                                                    address_1: streetName,
                                                    address_2: "",
                                                    city: city,
                                                    state: state,
                                                    postcode: "",
                                                    country: "PS",
                                                    phone: phone
                                                },
                                                shipping: {
                                                    first_name: first_name,
                                                    last_name: last_name,
                                                    address_1: streetName,
                                                    address_2: "",
                                                    city: city,
                                                    state: state,
                                                    postcode: "",
                                                    country: "PS",
                                                    phone: phone
                                                }
                                            };

                                            WooCommerce.put("customers/"+userID, dataxxx)
                                                .then((response) => {
                                                    console.log("errorns",response);
                                                })
                                                .catch((error) => {
                                                    console.log(error.response.data);
                                                });

                                            allListRes.forEach(item => {
                                                props.deleteFromList(item.id)
                                            });
                                            Toast.show({
                                                type: 'success',
                                                //Order has been successfully placed.
                                                text2: 'تم تقديم الطلب بنجاح.',
                                                topOffset: 70,
                                            });

                                            props.nav.navigate("Home");
                                        } else {
                                            setStep(2);
                                            Toast.show({
                                                type: 'error',
                                                text1: 'Error!',
                                                //Invalid or data missing in the required field(s)
                                                text2: 'غير صالحة أو بيانات مفقودة في الحقول المطلوبة',
                                                topOffset: 70,
                                            })
                                        }
                                    })
                                    .catch(error => {
                                      if (token){
                                        allListRes.forEach(item => {
                                          props.deleteFromList(item.id)
                                        });
                                        Toast.show({
                                          type: 'success',
                                          //Order has been successfully placed.
                                          text2: 'تم تقديم الطلب بنجاح.',
                                          topOffset: 70,
                                        });

                                        props.nav.navigate("Home");
                                      }else{
                                        setStep(2);
                                        Toast.show({
                                          type: 'info',
                                          text1: 'Warning!',
                                          //Invalid or data missing in the required field(s)
                                          text2: 'غير صالحة أو بيانات مفقودة في الحقول المطلوبة',
                                          topOffset: 70,
                                        })
                                      }

                                    })
                            }}
                            style={{
                                color: defines.backgroundColor,
                                fontWeight: 'bold',
                                borderRadius: 64,
                                textAlign: 'center',
                                width: window.width - 32,
                                alignSelf: 'center',
                                padding: 16,
                                backgroundColor: defines.backDarkPrimary
                            }}>
                            {/*Place Order*/}
                            {"أكد الطلب"}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.flex, {
                    justifyContent: 'flex-end',
                    marginVertical: 8,
                    marginHorizontal: 8,
                    marginBottom: 32
                }]}>
                    <TouchableOpacity
                        onPress={() => {
                            if (!(first_name.length <= 3 || last_name.length <= 3 || streetName.length <= 3 || city.length === 0 || state.length === 0 || phone.length <= 8)) {
                              if(userID != null){
                                setStep(2);
                              }else{
                                setStep(3);
                                registerUserWithPhone(phone, password)
                                  .then(response => {
                                    if(response.userId){
                                      setToken(true);
                                      setStep(2);
                                    }else{
                                      setStep(1);
                                      alert(response.message);
                                    }
                                  })
                                  .catch(error => {
                                    console.error('Error:', error);
                                  });
                              }

                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Error!',
                                    //Invalid or data missing in the required field(s)
                                    text2: 'غير صالحة أو بيانات مفقودة في الحقول المطلوبة',
                                    topOffset: 70,
                                })
                            }

                        }}
                        style={[styles.flex, {
                            display: step === 1 ? undefined : 'none',
                            justifyContent: 'center',
                            marginHorizontal: 8,
                            borderRadius: 6,
                            alignItems: 'center',
                            backgroundColor: defines.backDarkPrimary,
                            paddingVertical: 12,
                            width: 100
                        }]}>
                        <Text style={{
                            color: (first_name.length <= 3 || last_name.length <= 3 || streetName.length <= 3 || city.length === 0 || state.length === 0 || phone.length <= 8) ? "gray" : defines.backgroundColor,
                            fontWeight: 'bold',
                            fontSize: 17
                        }}>التالي</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setStep(1);
                        }}
                        style={[styles.flex, {
                            display: step === 2 ? undefined : 'none',
                            justifyContent: 'center',
                            marginHorizontal: 8,
                            borderRadius: 6,
                            alignItems: 'center',
                            backgroundColor: defines.backDarkPrimary,
                            paddingVertical: 12,
                            width: 100
                        }]}>
                        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 17}}>رجوع</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={{
                position: 'absolute',
                display: step === 3 ? undefined : 'none',
                backgroundColor: 'rgba(0,0,0,0.29)',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: window.height,
                width: window.width
            }}>
                <Progress.Bar indeterminate={true} color={defines.backDarkPrimary} animated={true} borderRadius={0}
                              borderWidth={0} indeterminateAnimationDuration={500} style={{
                    width: window.width
                }}/>
            </View>
        </View>
    );
};

export default ScreenCheckout;
