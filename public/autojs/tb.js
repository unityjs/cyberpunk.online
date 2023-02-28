"ui";

var color = "#009688";

ui.layout(
    // 抽屉布局，左边那个抽屉 
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="天猫淘宝抢购助手 v3.1" />
                <tabs id="tabs" />
            </appbar>
            <viewpager id="viewpager">
                <ScrollView>
                    <vertical padding="16">
                        <horizontal>
                            <text id="updateTime" text="网络时间同步中..." textColor="red" />
                        </horizontal>
                        <frame h="1" w="*" bg="#e3e3e3" marginTop="5" marginBottom="5" />
                        <horizontal>
                            <text text="直播商品关键字" textColor="black" />
                            <input id="liveItemName" textColor="gray" w="200" />
                        </horizontal>
                        <horizontal>
                            <text text="商品属性（分隔符;）" textColor="black" />
                            <input id="skus" textColor="gray" w="200" />
                        </horizontal>
                        <Switch id="autoPrice" text="预定价格" marginTop="10" />
                        <horizontal id="showPrice" marginLeft="10">
                            <text text="价格不超过" textColor="black" />
                            <input id="priceCeiling" inputType="numberDecimal" textColor="gray" w="60" />
                            <spinner id="priceSpinner" entries="元|倍" />
                        </horizontal>
                        <Switch id="autoPay" text="自动付款" marginTop="10" />
                        <vertical id="showPwd" marginLeft="10">
                            <horizontal>
                                <text text="支付密码" textColor="black" />
                                <input id="pwd" password="true" inputType="numberPassword" textColor="gray" w="100" />
                            </horizontal>
                            <horizontal>
                                <text text="付款间隔时间（秒）" inputType="number" textColor="black" />
                                <input id="payDelta" inputType="number" textColor="gray" w="100" />
                            </horizontal>
                        </vertical>
                        <frame h="1" w="*" bg="#e3e3e3" marginTop="5" marginBottom="5" />
                        <Switch id="autoAllCart" text="开团购物车全选" marginTop="10" />
                        <Switch id="refreshCart" text="开团使用下拉刷新" marginTop="10" />
                        <frame h="1" w="*" bg="#e3e3e3" marginTop="5" marginBottom="5" />
                        <horizontal>
                            <text text="提前开始时间（毫秒）" textColor="black" />
                            <input id="rushTime" inputType="number" textColor="gray" w="100" />
                        </horizontal>
                        <horizontal>
                            <text text="提交频率（毫秒）" textColor="black" />
                            <input id="rate" inputType="number" textColor="gray" w="100" />
                        </horizontal>
                        <horizontal>
                            <text text="抢购次数" inputType="number" textColor="black" />
                            <input id="duration" inputType="number" textColor="gray" w="100" />
                        </horizontal>
                        <button id="ok" text="开始抢购" style="Widget.AppCompat.Button.Colored" w="*" marginTop="30" />

                    </vertical>
                </ScrollView>
            </viewpager>
        </vertical>

        <vertical layout_gravity="left" bg="#ffffff" w="280">
            <img w="280" h="100" scaleType="fitXY" src="http://images.shejidaren.com/wp-content/uploads/2014/10/023746fki.jpg" />
            <list id="menu">
                <horizontal bg="?selectableItemBackground" w="*">
                    <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}" />
                    <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" />
                </horizontal>
            </list>
        </vertical>
    </drawer>
);

//<img id="timeBack" src="@drawable/ic_keyboard_arrow_left_black_48dp" h="40" bg="?selectableItemBackgroundBorderless" />
//<img id="timeFoward" src="@drawable/ic_keyboard_arrow_right_black_48dp" h="40" />
activity.setSupportActionBar(ui.toolbar);
ui.viewpager.setTitles(["淘宝"]);
ui.tabs.setupWithViewPager(ui.viewpager);

ui.toolbar.setupWithDrawer(ui.drawer);

ui.menu.setDataSource([
    {
        title: "恢复默认设置",
        icon: "@drawable/ic_android_black_48dp"
    },
    {
        title: "日志",
        icon: "@drawable/ic_find_in_page_black_48dp"
    },
    {
        title: "系统设置",
        icon: "@drawable/ic_settings_black_48dp"
    },
    {
        title: "关于",
        icon: "@drawable/ic_favorite_black_48dp"
    },
    {
        title: "退出",
        icon: "@drawable/ic_exit_to_app_black_48dp"
    }
]);


// 退出软件的方法
ui.menu.on("item_click", item => {
    switch (item.title) {
        case "恢复默认设置": storages.remove("tb"); break;
        case "日志": app.startActivity("console"); break;
        case "系统设置": app.startActivity("settings"); break;
        case "关于":
            dialogs.build({
                title: "关于",
                content: "本软件基于Auto.js编写，仅作学习和交流之用，不得商业使用及非法使用，否则一切后果自付\n此为免费软件，如您从其他途径获得，谨防病毒木马\n如有疑问及后续更新请联系开发者\n\n当前版本 : v3.0.0\n开发者微信 : zhss668",
                neutral: "去微信",
                positive: "确定",
                neutralColor: color,
                positiveColor: color,
            }).on("neutral", () => {
                setClip("zhss668");
                toast("已复制开发者微信号（zhss668）到剪切板");
                launch("com.tencent.mm");
            }).show();
            break;
        case "退出":
            ui.finish();
            break;
    }
})

let storage = storages.create("tb");

ui.autoPrice.on("check", function (checked) {
    storage.put("autoPrice", checked);
    ui.showPrice.visibility = checked ? 0 : 8;
});
ui.autoPay.on("check", function (checked) {
    storage.put("autoPay", checked);
    ui.showPwd.visibility = checked ? 0 : 8;
});
ui.autoAllCart.on("check", function (checked) {
    storage.put("autoAllCart", checked);
});
ui.refreshCart.on("check", function (checked) {
    storage.put("refreshCart", checked);
});
ui.showPwd.visibility = 8;
ui.autoAllCart.checked = storage.get("autoAllCart", false);
ui.refreshCart.checked = storage.get("refreshCart", false);
//ui.noSubmit.checked = false;
ui.autoPay.checked = storage.get("autoPay", false);
ui.autoPrice.checked = storage.get("autoPrice", false);
ui.pwd.setText(storage.get("pwd", ""));
ui.payDelta.setText(storage.get("payDelta", "0"));
ui.priceCeiling.setText(storage.get("priceCeiling", "50"));
ui.priceSpinner.setSelection(storage.get("priceSpinner", 0));
ui.rushTime.setText(storage.get("rushTime", "500"));
ui.rate.setText(storage.get("rate", "100"));
ui.duration.setText(storage.get("duration", "4"));
ui.skus.setText(storage.get("skus", "白色;黑色;L;自定义"));

//ui.emitter.on("resume", function () { ui.autoService.checked = auto.service != null; });

function getMsTime(t) {
    let s = (t % 60000) / 1000;
    return (s < 10 ? "0" : "") + s.toFixed(3);
}
let _fun_log = console.log;
let _fun_info = console.info;
let _fun_warn = console.warn;
let _fun_error = console.error;
let localOffsetTime = 0;
console.log = function (msg) { _fun_log(getMsTime(Date.now() + localOffsetTime) + ": " + msg); }
console.info = function (msg) { _fun_info(getMsTime(Date.now() + localOffsetTime) + ": " + msg); }
console.warn = function (msg) { _fun_warn(getMsTime(Date.now() + localOffsetTime) + ": " + msg); }
console.error = function (msg) { _fun_error(getMsTime(Date.now() + localOffsetTime) + ": " + msg); }

let threadBuy;

let packageID = "com.taobao.taobao:id/";
function updateTime(testCount) {
    threads.start(function () {
        try {
            let timeList = [];
            testCount = Math.max(testCount, 1);
            let halfTestCount = Math.max(Math.floor(testCount / 2), 1);
            for (let i = 0; i < testCount; ++i) {
                if (i != 0) sleep(2000);
                let start = Date.now();
                let res = http.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp");
                let netTime = res.body.json().data.t;
                let end = Date.now();
                let delay = end - start;
                let offset = netTime - start - delay;
                timeList.push({ offset: offset, delay: delay })
            }
            timeList.sort(function (a, b) { return a.delay - b.delay; })
            let offset = 0;
            let delay = 0;
            for (let i = 0; i < halfTestCount; ++i) {
                offset += timeList[i].offset;
                delay += timeList[i].delay;
            }
            offset = Math.floor(offset / halfTestCount);
            delay = Math.floor(delay / halfTestCount);
            localOffsetTime = offset;
            ui.run(() => {
                ui.updateTime.setText('当前时间偏移：' + offset + ' 网络延迟：' + delay);
            });
        } catch (e) { console.error(e); }
    });
}

function printNode(node) {
    let name = "";
    let depth = node.depth();
    while (depth > 0) {
        depth--;
        name += " ";
    }
    name += node.className().toString().split(".").pop();
    let parent = node.parent();
    if (parent) {
        let index = 0;
        let length = node.parent().childCount();
        for (; index < length; ++index) {
            if (node.parent().child(index) == node) break;
        }
        name += ":" + index + "/" + length;
    }
    console.log(name);
}
function printParent(node) {
    let parent = node.parent();
    if (parent) printParent(parent);
    printNode(node);
}

function printChildren(node) {
    printNode(node);
    node.children().forEach(child => {
        printChildren(node);
    });
}
function printNodes(node) {
    printParent(node)
    console.log("*");
    node.children().forEach(child => {
        printNode(node);
    });
    //printChildren(node)
}

ui.ok.click(function () {
    if (threadBuy && threadBuy.isAlive()) {
        ui.ok.setText("开始抢购");
        threadBuy.interrupt();
        threadBuy = null;
        eConfig.close();
        eTimer.close();
        console.info('已停止抢购');
    } else {
        if (ui.autoPay.checked && !/^[0-9][0-9][0-9][0-9][0-9][0-9]$/.test(ui.pwd.getText().toString())) {
            ui.pwd.setError("请输入6位数密码");
            return;
        }
        let priceCeiling = 0;
        let buyTime = 0;
        /*
            buyTime = new Date(ui.buyTime.getText()).getTime();
            if (isNaN(buyTime)) {
                ui.buyTime.setError("请输入正确的日期（年/月/日 时:分:秒）");
                return;
            }
            storage.put("buyTime", ui.buyTime.getText());
        */
        let rushTime = parseInt(ui.rushTime.getText()) || 0;
        let rate = parseInt(ui.rate.getText()) || 0;
        let duration = parseInt(ui.duration.getText()) || 0;
        let arrSkus = ui.skus.getText().toString().split(";");
        let payDelta = parseInt(ui.payDelta.getText()) || 0;
        let liveItemName = ui.liveItemName.getText().toString();

        storage.put("pwd", ui.pwd.getText().toString());
        storage.put("payDelta", ui.payDelta.getText().toString());
        storage.put("priceCeiling", ui.priceCeiling.getText().toString());
        storage.put("priceSpinner", ui.priceSpinner.getSelectedItemPosition());
        storage.put("rushTime", ui.rushTime.getText().toString());
        storage.put("rate", ui.rate.getText().toString());
        storage.put("duration", ui.duration.getText().toString());

        function clickBounds(kw) {
            let posb = kw.bounds();
            var w = posb.right - posb.left;
            var h = posb.bottom - posb.top;
            let x = posb.centerX() + (Math.random() * 0.6 - 0.3) * w;
            let y = posb.centerY() + (Math.random() * 0.6 - 0.3) * h;
            click(x, y);
        }
        function clickText(value, fixed) {
            if (!text(value).exists()) return false;
            //while (text(value).exists()) {
            let btn = text(value).findOne();
            if (fixed) {
                btn.parent().click();
                btn.parent().parent().click();
            } else {
                btn.click();
            }
            //}
            return true;
        }
        function pay() {
            let payStart = Date.now();
            while (true) {
                clickText("免密支付", true);
                clickText("立即付款", true);
                clickText("确认交易", true);
                if (id(packageID + "go_pwd").exists()) id(packageID + "go_pwd").findOne().click();
                clickText("使用密码", false);
                if (text("请输入支付密码").exists()) {
                    let pwd = "" + ui.pwd.getText();
                    for (let i = 0; i < 5; ++i) {
                        //let numID = "key_num_" + pwd[i];
                        // com.taobao.taobao:id/au_num_2
                        //while (!id(packageID+numID).exists()) { };
                        idMatches(new RegExp(".*(key|au).(num.)?" + pwd[i] + ".*")).findOne().click();
                        //clickBounds(idMatches(regexp_keypad).findOne());
                    }
                    if (payDelta > 0) sleep(1000 * (payDelta) - ((payStart + localOffsetTime) % 1000));
                    idMatches(new RegExp(".*(key|au).(num.)?" + pwd[5] + ".*")).findOne().click();
                    break;
                }
                clickText("跳过", true);
                if (text("交易成功").exists()) break;
            }
            let payEnd = Date.now();
            console.log("支付完成，耗时" + (payEnd - payStart) + "ms");
            //ll_key_area_num
        }

        let step = -1;
        let way = 0;
        function autoSkus() {
            let skusList = id(packageID + "sku_native_view_layout").findOne();
            sleep(100);
            for (let i = 0; i < skusList.childCount(); i++) {
                var skus = skusList.child(i).child(1);
                var selectID = -1;
                var otherID = -1;
                var defaultID = -1;
                for (let n = 0; n < arrSkus.length; ++n) {
                    let skuKey = arrSkus[n];
                    for (let j = 0; j < skus.childCount(); ++j) {
                        var sku = skus.child(j);
                        if (sku.contentDescription.indexOf("不可选择") != -1) continue;
                        if (sku.contentDescription.indexOf(skuKey) != -1) {
                            sku.click();
                            selectID = j;
                            break;
                        }
                        if (otherID < 0) otherID = j;
                        if (sku.selected()) defaultID = j;
                    }
                    if (selectID >= 0) break;
                }
                if (selectID < 0 && otherID >= 0 && defaultID < 0) {
                    skus.child(otherID).select();
                }
            }
        }
        let cartPrice = -1;
        let regNoZero = new RegExp(".*[1-9].*");
        function upateCartPrice(waitForNoZero) {
            /*console.log('uiSelector');
            let uiSelector = id(packageID + "tv_charge_closingcost_price")
            console.log('waitForNoZero');
            if (waitForNoZero) uiSelector.textMatches(regNoZero)
            console.log('textPrice');
            let textPrice = uiSelector.findOne();
            console.log('price');
            let price = parseFloat(("" + textPrice.text()).substring(1));*/
            let price = getCartPrice()
            // 刷新购物车价格
            if (cartPrice != price) {
                let cartPriceLog = "购物车合计: ￥" + price;
                priceCeiling = 0;
                if (ui.autoPrice.checked) {
                    priceCeiling = parseFloat(ui.priceCeiling.getText() || 0);
                    if (ui.priceSpinner.getSelectedItemPosition() == 1) priceCeiling = parseFloat((price * priceCeiling).toFixed(2));
                }
                if (priceCeiling > 0) cartPriceLog += '，预定价格: ￥' + priceCeiling;
                console.log(cartPriceLog);
                cartPrice = price;
                toast(cartPriceLog);
            }
            return price;
        }

        function getCartPrice() {
            let heji = className("android.widget.TextView").text("合计:").findOne()
            let parent = heji.parent();
            let depth = heji.depth();
            // 在"合计:"控件的父控件中，查找包含"￥"的子控件
            let textPrice = parent.findOne(className("android.widget.TextView").depth(depth).textContains("￥"))
            let price = parseFloat(textPrice.text().toString().substring(1));

            // 在"合计:"控件的父控件中，查找包含"共减￥.."的子控件
            let textHongbao = parent.findOne(className("android.widget.TextView").depth(depth).textContains("共减￥"))
            if (textHongbao) {
                let m = /共减￥(\d+.?\d*)/.exec(textHongbao.text().toString());
                if (m) price += parseFloat(m[1]);
            }
            return price;
        }

        function getPrice() {
            //let purchaseBottom = id(packageID+"purchase_bottom_layout").findOne();
            let heji = className("android.widget.TextView").text("合计:").findOne()
            let parent = heji.parent();
            let depth = heji.depth();
            // 在"合计:"控件的父控件中，查找包含"￥"的子控件
            let textPrice = parent.findOne(className("android.widget.TextView").depth(depth).textContains("￥"))
            let price = parseFloat(textPrice.text().toString().substring(1));

            // 在"合计:"控件的父控件的父控件中，查找包含"节省..元"的子控件
            let textHongbao = parent.parent().findOne(className("android.widget.TextView").depth(depth - 1).textContains("节省"))
            if (textHongbao) {
                let m = /节省(\d+.?\d*)元/.exec(textHongbao.text().toString());
                if (m) price += parseFloat(m[1]);
            }
            return price;
        }
        function refreshCart() {
            swipe(device.width * 0.95, device.height * 0.4, device.width * 0.95, device.height, 500);
            sleep(1800)
        }

        function checkCart() {
            let newBuyTime = 0;
            let items = JSON.parse(storage.get("items", "{}"));
            let hasStart = false;
            for (let name in items) {
                let item = items[name];
                if (item.buyTime == null || item.buyTime < Date.now() || item.buyTime > Date.now() + 48 * 60 * 60000) {
                    delete items[name];
                } else if (item.start) {
                    hasStart = true;
                    if (newBuyTime == 0 || newBuyTime > item.buyTime)
                        newBuyTime = item.buyTime;
                }
            }
            storage.put("items", JSON.stringify(items));
            if (!hasStart) {
                openTbCart();
                return;
            }
            //toast('开始自动化购物车，请不要手动操作...');
            //重启淘宝并打开购物车
            //killTb();
            openTbCart();
            //刷新购物车
            toast('刷新购物车');
            sleep(500)
            swipe(device.width * 0.5, device.height * 0.5, device.width * 0.5, device.height * 0.75, 10);
            sleep(500)
            refreshCart();

            let itemName;
            for (let i = 0; i < 20; ++i) {
                let firstItem = getCartFirstItem();
                if (!firstItem) break;
                let curItemName = getCartItemName(firstItem);
                if (itemName != curItemName) {
                    itemName = curItemName;
                    let item = items[itemName];
                    if (!item) {
                        // 删除购物车
                    } else if (item.start && item.buyTime == newBuyTime) {
                        // 勾选
                        console.log('勾选' + itemName);
                        clickCartItem(firstItem)
                    }
                }
                swipe(device.width * 0.5, device.height * 0.75, device.width * 0.5, device.height * 0.5, 300);
                sleep(200)
            }
            //for (let i = 0; i < 10; ++i) {
            swipe(device.width * 0.5, device.height * 0.5, device.width * 0.5, device.height * 0.75, 10);
            //}
            toast('自动化购物车完毕');
        }

        function killApp() {
            let packageName = currentPackage();
            app.openAppSetting(packageName);
            text(app.getAppName(packageName)).waitFor();
            let is_sure = textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne();
            if (is_sure.enabled()) {
                textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*)/).findOne().click();
                textMatches(/(.*强.*|.*停.*|.*结.*|.*行.*|.*确.*|.*定.*)/).findOne().click();
                log(app.getAppName(packageName) + "应用已被关闭");
                sleep(1000);
                back();
            } else {
                log(app.getAppName(packageName) + "应用不能被正常关闭或不在后台运行");
                back();
            }
        }

        function killTb() {
            app.launchApp("手机淘宝");
            sleep(5000);
            if (currentPackage() == "com.taobao.taobao")
                killApp();
        }

        function openTbCart() {
            toast('请手动打开手机淘宝或手机天猫');
            /*if (currentPackage() != "com.taobao.taobao") {
                toast('打开手机淘宝');
                app.launchApp("手机淘宝");
            }
            waitForPackage("com.taobao.taobao", 200)*/
            while (true) {
                if (currentPackage() == "com.taobao.taobao") {
                    break;
                }
                if (currentPackage() == "com.tmall.wireless") {
                    break;
                }
                sleep(300);
            }

            while (!(desc("购物车").exists() && (desc("我的淘宝").exists() || desc("我").exists()))) {
                back();
                sleep(300);
            }
            desc("购物车").findOne().click();
            toast('打开购物车');

            /*if (currentPackage() != "com.taobao.taobao") {
                console.log(currentPackage());
                sleep(1000);
                continue;
            }*/
        }
        function getCartFirstItem() {
            let cart_recycler_view = id(packageID + "cart_recycler_view").findOne();
            //let cartDepth = cart_recycler_view.depth();
            //let frameLayouts = cart_recycler_view.find(className("android.widget.FrameLayout").depth(cartDepth + 1));
            for (let i = 0; i < cart_recycler_view.childCount(); ++i) {
                let child = cart_recycler_view.child(i);
                if (child.className() != "android.widget.FrameLayout") continue;
                if (child.childCount() != 1) continue;
                child = child.child(0);
                if (child.className() != "android.widget.FrameLayout") continue;
                if (child.childCount() == 0) continue;
                child = child.child(0);
                if (child.className() != "android.widget.FrameLayout") continue;
                //if (child.childCount() != 1) continue;
                while (child.childCount() > 0) child = child.child(0);
                return child.parent();
            }
            return null;

            /*let firstItem = cart_recycler_view.find(className("android.widget.FrameLayout").depth(cartDepth + 1)).findOne(className("android.widget.FrameLayout").depth(cartDepth + 2))
            if (firstItem) {
                while (firstItem.childCount() > 0) firstItem = firstItem.child(0);
                firstItem = firstItem.parent();
            }
            return firstItem;*/
        }

        function getCartItemName(item) {
            //let views = item.find(className("android.view.View").depth(item.depth() + 1));
            let views = item.find(className("android.view.View"));
            //if (views.size() < 3) return undefined;
            for (let i = 0; i < views.size(); ++i) {
                let desc = views.get(i).desc();
                if (desc == null) continue;
                if (desc.indexOf("勾选按钮") != -1) continue;
                return desc;
            }
        }


        function getCartItemCheckBox(item) {
            return item.findOne(className("android.view.View").depth(item.depth() + 1).descContains("勾选按钮，商品未选中"));
        }
        function clickCartItem(item) {
            let checkBox = getCartItemCheckBox(item);
            if (checkBox) {
                checkBox.click();
                return true;
            }
            return false;
        }

        function deleteCartItem(item) {
            desc("管理").findOne().click();
            sleep(100)
            clickCartItem(item);
            sleep(100)
            id(packageID + "button_delete_layout").findOne().click();
            sleep(100)
            id(packageID + "ack_dialog_confirm_bnt_sure").findOne().click();
            sleep(100)
            desc("完成").findOne().click();
        }

        function selectOneItem(waitForTuan) {
            let cart_recycler_view = id(packageID + "cart_recycler_view").findOne();
            let cartDepth = cart_recycler_view.depth();
            let hadChecked = cart_recycler_view.find(className("android.widget.FrameLayout").depth(cartDepth + 1))
                .find(className("android.widget.FrameLayout").depth(cartDepth + 2))
                .findOne(className("android.view.View").descContains("勾选按钮，商品已选中"));
            if (hadChecked) {
                let curItemName = getCartItemName(hadChecked.parent());
                console.log("已选：" + curItemName);
                return;
            }
            console.log('自动勾选商品');

            while (true) {
                let firstItem = getCartFirstItem();
                if (!firstItem) continue;
                if (ui.autoAllCart.checked) {
                    if (getCartItemCheckBox(firstItem)) {
                        let checkbox_charge = id(packageID + "checkbox_charge").findOne();
                        if (checkbox_charge)
                            checkbox_charge.click();
                        sleep(300);
                        upateCartPrice(true)
                        break;
                    }
                } else {
                    if (clickCartItem(firstItem)) {
                        let curItemName = getCartItemName(firstItem);
                        console.log("选择：" + curItemName);
                        upateCartPrice(true)
                        break;
                    }
                }

                if (!waitForTuan) return;
                if (ui.refreshCart.checked) {
                    refreshCart();
                } else {
                    let back = desc("返回").findOnce();
                    if (back) back.click();
                    else {
                        console.log('刷新购物车');
                        firstItem.click();
                        /*let views = firstItem.find(className("android.view.View").depth(itemDepth + 1));
                        let itemDesc = views.get(views.size() - 1);
                        console.log(itemDesc.desc());
                        clickBounds(itemDesc);
                        console.log(views.size());
                        itemDesc.click();
                        console.log(views.size());*/
                    }
                    sleep(100);
                    className("android.widget.TextView").desc("购物车").findOne().click();//不是百分百有效
                }
                console.log('等待开团');
                sleep(rate);
            }
        }

        let regBuy1 = new RegExp(".*(立即购买|确认|确定|马上).*");
        let regGoumai = new RegExp(".*(购买|确认|确定|马上).*");
        //function upateCartPrice(waitForNoZero) {
        //    let uiSelector = id(packageID+"footer").textMatches(regGoumai)
        //    if (waitForNoZero) uiSelector

        function autoBuy() {
            let tryCount = 0;
            let purchaseChanged = false;
            while (true) {
                if (tryCount > 0) {
                    // 天猫要再次勾选
                    if (step == 3 && currentPackage() == "com.tmall.wireless") {
                        selectOneItem(true); //检查选购情况，如果没有自动选第一个
                    }
                    //if (Date.now() + localOffsetTime - buyTime > duration * 1000) { console.error('超出预定抢购时长'); return; }
                    if (tryCount > duration) { console.error('超出抢购次数'); return; }
                    sleep(rate);
                }
                tryCount++;
                //连击
                if (step == 1) {
                    //let ll_bottom_bar_content = id(packageID+"ll_bottom_bar_content").findOne();
                    //let btn = ll_bottom_bar_content.child(4).child(0);
                    //while (btn.id() != "detail_main_sys_button") { btn = ll_bottom_bar_content.child(4).child(0); }
                    //btn.click();
                    sleep(100);
                    textMatches(regBuy1).findOne().click();
                    //clickBounds(textMatches(regBuy1).findOne());
                    console.log("2");
                    //id(packageID+"confirm").waitFor();
                    /*id(packageID+"footer").*/textMatches(regGoumai).waitFor();
                    console.log("3");
                    autoSkus();
                    console.log("4");
                    step = 2;
                    id(packageID + "footer").textMatches(regGoumai).findOne().click();
                } else if (step == 2) {
                    //id(packageID+"confirm").findOne().click();
                    id(packageID + "footer").textMatches(regGoumai).findOne().click();
                    //id(packageID+"confirm_text").textContains("购买").findOne().click();
                } else if (step == 3) {
                    //id(packageID+"button_cart_charge").findOne().click();
                    className("android.widget.FrameLayout").descContains("结算").findOne().click();
                    //while (!id(packageID+"purchase_bottom_layout").exists()) { }
                }
                let submit = className("android.widget.TextView").text("提交订单").findOne();
                let price = getPrice();
                if (price <= 0) {
                    let text = textContains("购买数量超过了限购数").findOnce();
                    if (text) {
                        console.error(text.text());
                        break;
                    }
                    console.warn('库存不足');
                    //id(packageID+"btn_back").findOnce().click();
                    back();
                    if (way == 0) step = 3;
                    else step = 2;
                    continue;
                }
                if (priceCeiling > 0 && price > priceCeiling) {
                    console.warn('当前价格：￥' + price + ' 已超出预定');
                    //id(packageID+"btn_back").findOnce().click();
                    back();
                    if (way == 0) step = 3;
                    else step = 2;
                    if (purchaseChanged) {
                        console.error('商品已恢复原价');
                        break;
                    }
                    continue;
                }
                console.log('当前价格：￥' + price + ' 准备提交订单');
                //if (ui.noSubmit.checked) break;
                submit.click();
                let success = false;
                while (true) {
                    if (text("立即付款").exists() || text("免密支付").exists() || text("确认交易").exists()) {
                        if (ui.autoPay.checked) pay();
                        success = true;
                        break;
                    }
                    let btn = id(packageID + "purchase_new_dialog_right_btn").findOnce();
                    if (btn) {
                        console.error(id(packageID + "purchase_new_dialog_desc").findOnce().text());
                        btn.click();
                        purchaseChanged = true;
                        break;
                    }
                    // 向右滑动验证 休息会呗，坐下来喝口水，  亲，访问受限了nc_1_n1t  nc_1-stage-1 nocaptcha
                    btn = text("向右滑动验证").findOnce();
                    if (btn) {
                        console.warn('滑块验证');
                        let bounds = btn.bounds();
                        swipe(bounds.left + Math.random() * 50 + 20, bounds.centerY() + (Math.random() * 10 - 5),
                            bounds.right - Math.random() * 50, bounds.centerY() + (Math.random() * 10 - 5), 2000);
                        break;
                    }
                }
                if (success)
                    break;
            }
        }

        function autoMsq(title) {
            let target = className("android.view.View").desc(title).findOne();
            if (target.depth() >= 22) {
                return target.parent().parent().parent().parent().findOne(className("android.view.View").desc("马上抢"));
            } else {
                return target.parent().findOne(className("android.view.View").desc("马上抢"));
            }
        }
        function autoLiveBuy(title) {
            let tryCount = 0;
            let purchaseChanged = false;
            while (true) {
                if (tryCount > 0) {
                    //if (Date.now() + localOffsetTime - buyTime > duration * 1000) { console.error('超出预定抢购时长'); return; }
                    if (tryCount > duration) { console.error('超出抢购次数'); return; }
                    sleep(rate);
                }
                tryCount++;

                let msq;
                while ((msq = autoMsq(title)) == null) { }
                msq.parent().click();
                id(packageID + "buy").waitFor();
                autoSkus();
                id(packageID + "buy").click();

                let submit = className("android.widget.TextView").text("提交订单").findOne();
                let price = getPrice();
                if (price <= 0) {
                    let text = textContains("购买数量超过了限购数").findOnce();
                    if (text) {
                        console.error(text.text());
                        break;
                    }
                    console.warn('库存不足');
                    //id(packageID+"btn_back").findOnce().click();
                    back();
                    //if (way == 0) step = 3;
                    //else step = 2;
                    continue;
                }
                if (priceCeiling > 0 && price > priceCeiling) {
                    console.warn('当前价格：￥' + price + ' 已超出预定');
                    //id(packageID+"btn_back").findOnce().click();
                    back();
                    //if (way == 0) step = 3;
                    // else step = 2;
                    if (purchaseChanged) {
                        console.error('商品已恢复原价');
                        break;
                    }
                    continue;
                }
                console.log('当前价格：￥' + price + ' 准备提交订单');
                submit.click();
                let success = false;
                while (true) {
                    if (text("立即付款").exists()) {
                        if (ui.autoPay.checked) pay();
                        success = true;
                        break;
                    }
                    let btn = id(packageID + "purchase_new_dialog_right_btn").findOnce();
                    if (btn) {
                        console.error(id(packageID + "purchase_new_dialog_desc").findOnce().text());
                        btn.click();
                        purchaseChanged = true;
                        break;
                    }
                    // 向右滑动验证 休息会呗，坐下来喝口水，  亲，访问受限了nc_1_n1t  nc_1-stage-1 nocaptcha
                    btn = text("向右滑动验证").findOnce();
                    if (btn) {
                        console.warn('滑块验证');
                        let bounds = btn.bounds();
                        swipe(bounds.left + Math.random() * 50 + 20, bounds.centerY() + (Math.random() * 10 - 5),
                            bounds.right - Math.random() * 50, bounds.centerY() + (Math.random() * 10 - 5), 2000);
                        break;
                    }
                }
                if (success)
                    break;
            }
        }

        function startBuy() {
            try {
                //if (ui.autoAllCart.checked)
                checkCart();
                //if (buyTime < Date.now()) {
                //    console.error('超过预定抢购时间');
                //    return;
                //}
                buyTime = 0;
                step = -1;
                let itemName = "";
                while (true) {
                    let newStep = 0;
                    let newBuyTime = 0;
                    let curItemName = "default";
                    //if (id(packageID+"purchase_bottom_layout").exists())
                    if (className("android.widget.TextView").text("提交订单").exists()) {
                        newStep = 4;
                        //} else if (id(packageID+"button_cart_charge").exists()) {
                        // 找到结算按钮
                    } else if (className("android.widget.FrameLayout").descContains("结算").exists()) {
                        way = 0;
                        newStep = 3;
                        // 寻找第一个物品
                        let firstItem = getCartFirstItem();
                        if (firstItem) curItemName = getCartItemName(firstItem);

                        //console.log(firstItem ? curItemName : '0');
                        let items = JSON.parse(storage.get("items", "{}"));
                        let item = items[curItemName];
                        if (item && item.start && item.buyTime == buyTime) {
                            clickCartItem(firstItem)
                        }
                    } else if (id(packageID + "skupage_bottombar_layout").exists()) {
                        way = 1;
                        newStep = 2;
                    } else if (id(packageID + "ll_bottom_bar_content").exists()) {
                        way = 1;
                        newStep = 1;
                    } else if (id(packageID + "taolive_showcase_item_name").exists()) {
                        let showcase = id(packageID + "taolive_showcase_item_name").findOne();
                        let title = showcase.text().toString();
                        if (liveItemName.length > 0 && title.indexOf(liveItemName) == -1) continue;
                        //let productSwitch = id(packageID+"taolive_product_switch_btn").findOne().parent();
                        console.log("[" + title + "]");
                        //productSwitch.click()
                        //showcase.click()
                        id(packageID + "taolive_showcase_item_add_cart").findOne().click();
                        //clickBounds(showcase);
                        //console.log('开始直播下单');
                        buyTime = Date.now() + localOffsetTime;
                        way = 1;
                        step = 1;
                        autoBuy();
                        break;
                        // let showcase = id(packageID+"taolive_showcase_item_name").findOne();
                        //console.log(currentPackage());
                    } else if (currentPackage().indexOf("ojs") != -1) {
                        sleep(1000);
                        continue;
                    }
                    if (step != newStep) {
                        step = newStep;
                        if (step == 0) {
                            itemName = "";
                            eConfig.close();
                            eTimer.close();
                        }
                        if (step == 0) toast('请前往购物车或商品页面');
                        if (step == 1) toast('已进入商品页，脚本将自动购买');
                        if (step == 2) toast('已进入商品属性页，请选择商品属性，脚本将自动购买');
                        if (step == 3) {
                            toast('已进入购物车');
                            cartPrice = -1;
                            upateCartPrice(false);
                        }
                        if (step == 4) {
                            let price = getPrice();
                            toast('订单合计: ' + price + '，脚本将自动提交订单');
                        }
                    }
                    if (step > 0) {
                        // 更新ItemName
                        if (itemName != curItemName) {
                            itemName = curItemName;
                            //console.log(itemName);
                            eConfig.open(itemName);
                        }
                        if (step == 3) {
                            let items = JSON.parse(storage.get("items", "{}"));
                            for (let name in items) {
                                if (name == "default") continue;
                                let item = items[name];
                                if (item.start && item.buyTime > Date.now()) {
                                    if (newBuyTime == 0 || newBuyTime > item.buyTime)
                                        newBuyTime = item.buyTime;
                                }
                            }
                        } else if (step != 0) {
                            let items = JSON.parse(storage.get("items", "{}"));
                            let item = items["default"];
                            if (item && item.start && item.buyTime > Date.now())
                                newBuyTime = item.buyTime;
                        }
                        // 更新时间
                        if (buyTime != newBuyTime) {
                            buyTime = newBuyTime;
                            if (buyTime > 0)
                                toast("抢购时间：" + new java.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date(buyTime)))
                            else
                                toast("抢购暂停")
                        }
                        eTimer.open(buyTime - localOffsetTime)
                    }
                    //if (ui.autoLive.checked && buyTime == 0) {
                    //    sleep(1000);
                    //    continue;
                    //}
                    if (step == 0) {
                        sleep(1000);
                    } else if (buyTime <= 0) {
                        sleep(1000);
                        //console.log('开始抢购 ' + new java.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date(getBuyTime())));
                    } else {
                        // 30秒前
                        let countdown = buyTime - rushTime - Date.now() - localOffsetTime;
                        if (countdown > 8000) {
                            let sec = Math.floor(countdown / 1000);
                            if (sec % 10 == 0)
                                click(0, 0); // 10秒一次防止息屏
                            if (step == 3)
                                upateCartPrice(false);
                            // else if (step == 0 && countdown < 30000) {
                            // 强制打开购物车
                            //openCart()
                            //selectOneItem(false);
                            //sleep(5000);
                            //}
                            if (sec > 60 && (sec % 60) == 0) {
                                updateTime(6);
                            }
                            sleep(1000);
                        } else if (countdown > -3000) {
                            //eConfig.close();
                            if (step == 3) {
                                upateCartPrice(false);
                                if (cartPrice <= 0)
                                    selectOneItem(true); //检查选购情况，如果没有自动选第一个
                                if (currentPackage() == "com.taobao.taobao") {
                                    // 页面预加载
                                    //id(packageID+"button_cart_charge").findOne().click();
                                    className("android.widget.FrameLayout").descContains("结算").findOne().click();
                                    sleep(500);
                                    back();
                                }
                            }
                            while (true) { if (buyTime - rushTime - Date.now() - localOffsetTime <= 0) break; }
                            console.log('开始下单');
                            autoBuy();
                            break;
                        } else {
                            //eConfig.close();
                            console.error('您错过了下单时间');
                            break;
                        }
                    }
                }
                console.log('抢购完成');

            } catch (e) { console.error(e); }
            eConfig.close();
            eTimer.close();
        }

        if (auto.service == null) {
            ui.ok.setText("请开启无障碍服务");
            toast("请先开启无障碍服务！");
            app.startActivity({ action: "android.settings.ACCESSIBILITY_SETTINGS" });
        }

        threadBuy = threads.start(function () {
            while (auto.service == null) sleep(1000);
            ui.ok.setText("停止抢购");
            console.show();
            console.log('准备开始抢购...');
            while (true) {
                startBuy();
                sleep(5000);
                console.log('准备下一轮抢购...');
            }
            //console.log('抢购结束');
            //ui.ok.setText("开始抢购");
        });
    }
})

function ExecScript(func) {
    this.e = null;
    this.name = func.name;
    this.script = func.toString()
}
/*ExecScript.prototype.emit = function (data) {
    if (this.e && this.e.getEngine()) this.e.getEngine().emit("data", data);
    //else this.e = exec(showConfig, data);
}*/
ExecScript.prototype.open = function (data) {
    if (this.e && this.e.getEngine()) this.e.getEngine().emit("data", data);
    else this.e = engines.execScript(this.name, this.name + "(" + JSON.stringify(data) + ");\n" + this.script);
    //console.log(this.name + "(" + JSON.stringify(data) + ");");
}
ExecScript.prototype.close = function (data) {
    if (this.e && this.e.getEngine()) this.e.getEngine().forceStop();
    this.e = null;
}

function showTimer(data) {
    let f = floaty.rawWindow(
        <vertical w="*">
            <text id="timer" w="auto" layout_gravity="center_horizontal" textColor="black" textStyle="bold" textSize="26sp" />
        </vertical>
    );
    f.setTouchable(false);
    f.setPosition(device.width * 0.3, 180);
    f.setSize(device.width * 0.4, -2)

    let time = data;
    events.on("data", (value) => { time = value });

    setInterval(() => {
        let remaining = time - Date.now();
        if (remaining > 0 && remaining < 3600000 * 100) {
            let hour = Math.floor(remaining / 3600000);
            let minute = Math.floor(remaining / 60000) % 60;
            let s = Math.floor(remaining / 1000) % 60;
            ui.run(() => { f.timer.setText(("0" + hour).slice(-2) + ":" + ("0" + minute).slice(-2) + ":" + ("0" + s).slice(-2)); });
        } else ui.run(() => { f.timer.setText("00:00:00"); });
    }, 1000);
}
let eTimer = new ExecScript(showTimer);

function showConfig(data) {
    let storage = storages.create("tb");
    let itemName = "";
    function getBuyTime() {
        let hours = Math.floor(Date.now() / 3600000) + 1;
        let hoursTimes = "0,8,10,11,12,13,14,15,17,19,20,21,22,23".split(",");
        for (let i = 0; i < 24; ++i) {
            let h = (hours + 8) % 24;
            for (let j = 0; j < hoursTimes.length; ++j) {
                if (h == hoursTimes[j])
                    return hours * 3600000;
            }
            hours++;
        }
        hours -= 24;
        return hours * 3600000;
    }
    function setItem(value) {
        if (itemName == value) return;
        itemName = value;
        let items = JSON.parse(storage.get("items", "{}"));
        let item = items[itemName];
        let buyTime;
        let start = false;
        if (!item) {
            buyTime = getBuyTime();
            /*let res = http.get('https://www.52baicai.com/getitem?name=' + itemName);
            if (res.statusCode == 200) {
                let result = res.body.json();
                if (result.success) {
                    buyTime = result.data.time;
                    items[itemName] = { buyTime: buyTime, start: start };
                    storage.put("items", JSON.stringify(items));
                }
            }*/
        } else {
            buyTime = item.buyTime;
            start = item.start;
            if (!(buyTime > Date.now())) {
                buyTime = getBuyTime();
                start = false;
            }
        }
        ui.run(() => {
            f.itemName.setText(itemName.substr(0, 10));
            f.itemName.setBackgroundColor(start ? logColor : colorClear);
            f.buyTime.setText(new java.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date(buyTime)));
            f.ok.setText(start ? "停止" : "开始");
            f.ok.setBackgroundColor(start ? colorRed : colorGreen);
        });
    }

    let inputFocus = false;
    let f = floaty.rawWindow(
        <vertical id="bg" bg="#aaffffff" w="*">
            <text id="itemName" w="auto" layout_gravity="center_horizontal" textColor="black" bg="#aaffffff" textSize="12sp" />
            <horizontal w="auto" layout_gravity="center_horizontal" >
                <text id="sub" bg="#aa000088" textColor="white" text="-" textSize="8sp" w="20" h="20" margin="2" />
                <input id="buyTime" textColor="black" textStyle="bold" bg="#aaffffff" w="95" textSize="10sp" focusable="true" />
                <text id="plus" bg="#aa000088" textColor="white" text="+" textSize="8sp" w="20" h="20" margin="2" />
            </horizontal>
            <button id="ok" layout_gravity="center_horizontal" bg="#aa000088" textColor="white" text="开始" textSize="8sp" w="30" h="30" />
        </vertical>
    );
    //f.setTouchable(false);
    f.setPosition(device.width * 0.3, 280);
    f.setSize(device.width * 0.4, -2)

    let norColor = colors.parseColor("#aaffffff");
    let logColor = colors.parseColor("#aa008800");
    let errColor = colors.parseColor("#aa880000");
    let colorClear = colors.parseColor("#00000000");
    let colorRed = colors.parseColor("#aa880000");
    let colorGreen = colors.parseColor("#aa008800");
    let colorBlur = colors.parseColor("#aa000088");

    events.on("show", (value) => {
        ui.run(() => {
            //f.bg.visibility = value ? 0 : 8;
            if (value) f.setSize(device.width * 0.4, -2);
            else f.setSize(3, 3);

            f.bg.setBackgroundColor(norColor);
            f.disableFocus();
        });
    });

    events.on("data", (value) => { setItem(value); });
    /*events.on("config", (value) => {
        ui.run(() => {
            if (value.x != null && value.y != null) {
                f.setPosition(value.x, value.y);
            } else f.setPosition(0, device.height - 300);
            //f.info.setBackgroundColor(logColor);
            //f.info.setText(value)
        })
    });*/

    f.buyTime.on("key", function (keyCode, event) {
        if (event.getAction() == event.ACTION_DOWN && (keyCode == keys.back || keyCode == 13)) {
            console.log("选择：key");
            f.disableFocus();
            inputFocus = false;
            event.consumed = true;
        }
    });

    f.buyTime.on("touch_down", () => {
        f.requestFocus();
        f.buyTime.requestFocus();
        f.bg.setBackgroundColor(errColor);
        inputFocus = true;
    });

    f.bg.click(function () {
        f.bg.setBackgroundColor(norColor);
        f.disableFocus();
    });

    f.ok.on("long_click", () => {
        //f.setAdjustEnabled(!f.isAdjustEnabled());
    });
    f.sub.click(function () {
        f.buyTime.setText(new java.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date(new Date(f.buyTime.getText()).getTime() - 3600000)));
    });
    f.plus.click(function () {
        f.buyTime.setText(new java.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date(new Date(f.buyTime.getText()).getTime() + 3600000)));
    });
    f.ok.click(function () {
        f.bg.setBackgroundColor(norColor);
        f.disableFocus();
        let buyTime = new Date(f.buyTime.getText()).getTime();
        let start = f.ok.getText() == "开始";
        f.itemName.setBackgroundColor(start ? logColor : colorClear);
        f.ok.setText(start ? "停止" : "开始");
        let items = JSON.parse(storage.get("items", "{}"));
        items[itemName] = { buyTime: buyTime, start: start };
        storage.put("items", JSON.stringify(items));
    });
    setInterval(() => { }, 200);
    setItem(data);
}
let eConfig = new ExecScript(showConfig);

updateTime(6);