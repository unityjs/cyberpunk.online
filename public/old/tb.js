"ui";

var color = "#009688";

ui.layout(
    // 抽屉布局，左边那个抽屉
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" title="天猫淘宝抢购助手 v3.1" />
            </appbar>
            <vertical padding="16">
                <text id="timeInfo" textSize="12" textColor="red" text="正在检测网络延迟..." marginTop="10" />
                <Switch id="autoService" text="无障碍服务" checked="{{auto.service != null}}" marginTop="10" />
                <Switch id="allCart" text="购物车全选" marginTop="10" />
                <Switch id="takeLeftover" text="自动捡漏" marginTop="10" />
                <Switch id="autoPay" text="自动付款" marginTop="10" />
                <horizontal id="showPwd">
                    <text text="支付密码" textColor="black" />
                    <input id="pwd" password="true" inputType="numberPassword" textColor="gray" w="100" />
                </horizontal>
                <frame h="1" w="*" bg="#e3e3e3" marginTop="20" marginBottom="20" />
                <horizontal>
                    <checkbox id="usePriceCeiling" text="价格大于" textColor="black" />
                    <input id="priceCeiling" inputType="numberDecimal" textColor="gray" w="60" />
                    <text text="元时不提交" textColor="black" />
                </horizontal>
                <horizontal>
                    <checkbox id="usePriceCeiling2" text="价格大于" textColor="black" />
                    <input id="priceCeiling2" inputType="numberDecimal" textColor="gray" w="60" />
                    <text text="倍时不提交" textColor="black" />
                </horizontal>
                <horizontal>
                    <text text="开始时间" textColor="black" />
                    <input id="buyTime" textColor="gray" w="200" />
                </horizontal>
                <horizontal>
                    <text text="提前开始时间（毫秒）" textColor="black" />
                    <input id="rushTime" inputType="number" textColor="gray" w="100" />
                </horizontal>
                <horizontal>
                    <text text="提交频率（毫秒）" textColor="black" />
                    <input id="rate" textColor="gray" w="100" />
                </horizontal>
                <horizontal>
                    <text text="抢购维持时间（秒）" inputType="number" textColor="black" />
                    <input id="duration" inputType="number" textColor="gray" w="100" />
                </horizontal>
                <button id="ok" text="开始抢购" style="Widget.AppCompat.Button.Colored" w="*" marginTop="30" />
            </vertical>
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

/*<horizontal>
<text text="商品属性（分隔符;）" inputType="number" textColor="black" />
<input id="skus" textColor="gray" w="200" />
</horizontal>*/
//<img id="timeBack" src="@drawable/ic_keyboard_arrow_left_black_48dp" h="40" bg="?selectableItemBackgroundBorderless" />
//<img id="timeFoward" src="@drawable/ic_keyboard_arrow_right_black_48dp" h="40" />
activity.setSupportActionBar(ui.toolbar);

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
ui.autoService.on("check", function (checked) {
    if (checked && auto.service == null) app.startActivity({ action: "android.settings.ACCESSIBILITY_SETTINGS" });
    if (!checked && auto.service != null) auto.service.disableSelf();
});

ui.allCart.on("check", function (checked) { storage.put("allCart", checked); });
ui.takeLeftover.on("check", function (checked) { storage.put("takeLeftover", checked); });
ui.usePriceCeiling.on("check", function (checked) { storage.put("usePriceCeiling", checked); if (checked && ui.usePriceCeiling2.checked) ui.usePriceCeiling2.checked = false });
ui.usePriceCeiling2.on("check", function (checked) { storage.put("usePriceCeiling2", checked); if (checked && ui.usePriceCeiling.checked) ui.usePriceCeiling.checked = false });
ui.autoPay.on("check", function (checked) {
    storage.put("autoPay", checked);
    ui.showPwd.visibility = checked ? 0 : 8;
});

ui.showPwd.visibility = 8;
ui.allCart.checked = storage.get("allCart", false);
ui.takeLeftover.checked = storage.get("takeLeftover", true);
ui.autoPay.checked = storage.get("autoPay", false);
ui.usePriceCeiling.checked = storage.get("usePriceCeiling", false);
ui.usePriceCeiling2.checked = storage.get("usePriceCeiling2", false);
ui.pwd.setText(storage.get("pwd", ""));

ui.buyTime.setText(storage.get("buyTime", ""));
let buyTime = new Date(ui.buyTime.getText()).getTime();
if (isNaN(buyTime) || buyTime < Date.now()) {
    let hours = Math.floor(Date.now() / 3600000);
    hours += Math.max(0, 7 - ((hours + 8) % 24)) + 1;
    ui.buyTime.setText(new java.text.SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(new Date(hours * 3600000)));
}

ui.priceCeiling.setText(storage.get("priceCeiling", "50"));
ui.priceCeiling2.setText(storage.get("priceCeiling2", "0.7"));
ui.rushTime.setText(storage.get("rushTime", "500"));
ui.rate.setText(storage.get("rate", "100"));
ui.duration.setText(storage.get("duration", "5"));
//ui.skus.setText(storage.get("skus", "白色;黑色;L;自定义"));

ui.emitter.on("resume", function () { ui.autoService.checked = auto.service != null; });

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

ui.ok.click(function () {
    if (threadBuy && threadBuy.isAlive()) {
        ui.ok.setText("开始抢购");
        threadBuy.interrupt();
        threadBuy = null;
        console.info('已停止抢购');
    } else {
        if (auto.service == null) {
            toast("请先开启无障碍服务！");
            return;
        }
        let pwd = "";
        if (ui.autoPay.checked) {
            pwd += ui.pwd.getText();
            var re = /^[0-9][0-9][0-9][0-9][0-9][0-9]$/;
            if (!re.test(pwd)) {
                ui.pwd.setError("请输入6位数密码");
                return;
            }
        }
        let priceCeiling = 0;
        if (ui.usePriceCeiling.checked) {
            if (!(parseFloat(ui.priceCeiling.getText()) >= 0)) {
                ui.priceCeiling.setError("请输入整数");
                return;
            }
        }
        if (ui.usePriceCeiling2.checked) {
            if (!(parseFloat(ui.priceCeiling2.getText()) >= 0)) {
                ui.priceCeiling2.setError("请输入整数");
                return;
            }
        }
        let buyTime = new Date(ui.buyTime.getText()).getTime();
        if (isNaN(buyTime)) {
            ui.buyTime.setError("请输入正确的日期（年/月/日 时:分:秒）");
            return;
        }
        let rushTime = parseInt(ui.rushTime.getText());
        if (!(rushTime >= 0 && rushTime <= 1000)) {
            ui.rushTime.setError("请输入0-1000之间的整数");
            return;
        }
        let rate = parseInt(ui.rate.getText());
        if (!(rate >= 50)) {
            ui.rate.setError("请输入大于50的整数");
            return;
        }
        let duration = parseInt(ui.duration.getText());
        if (!(duration >= 0)) {
            ui.duration.setError("请输入整数");
            return;
        }
        if (duration * 1000 / rate > 50) {
            ui.duration.setError("抢购次数过多，请调低频率或时长");
            return;
        }
        //let arrSkus = ("" + ui.skus.getText()).split(";");

        ui.ok.setText("停止抢购");

        storage.put("pwd", "" + ui.pwd.getText());
        storage.put("buyTime", "" + ui.buyTime.getText());
        storage.put("priceCeiling", "" + ui.priceCeiling.getText());
        storage.put("priceCeiling2", "" + ui.priceCeiling2.getText());
        storage.put("rushTime", "" + ui.rushTime.getText());
        storage.put("rate", "" + ui.rate.getText());
        storage.put("duration", "" + ui.duration.getText());
        //storage.put("skus", "" + ui.skus.getText());

        function clickBounds(kw) {
            let posb = kw.findOne().bounds();
            click(posb.centerX() + (Math.random() * 4 - 2), posb.centerY() + (Math.random() * 4 - 2));
        }
        function pay() {
            let payStart = Date.now();
            //if (text("立即付款").exists()) clickBounds(text("立即付款"));  //text("立即付款").findOne().click();
            if (text("确认交易").exists()) clickBounds(text("确认交易"));  //text("立即付款").findOne().click();
            else if (id("com.taobao.taobao:id/go_pwd").exists()) clickBounds(id("com.taobao.tobao:id/go_pwd"));
            //while (!id("com.taobao.taobao:id/key_num_1").exists()) { };
            console.log("等待请输入支付密码")
            while (!text("请输入支付密码").exists()) { }
            for (let i = 0; i < 6; ++i) {
                let regexp_keypad = new RegExp(".*key.(num.)?" + pwd[i] + ".*");
                //let numID = "com.taobao.taobao:id/key_num_" + pwd[i];
                //while (!id(numID).exists()) { };
                idMatches(regexp_keypad).findOne().click();
                //clickBounds(idMatches(regexp_keypad));
            }
            let payEnd = Date.now();
            console.log("支付完成，耗时" + (payEnd - payStart) + "ms");
            //ll_key_area_num
        }

        let step = -1;
        let platform = -1;
        let way = 0;
        function autoSkus() {
            id("com.taobao.taobao:id/confirm").waitFor();
            let skusList = id("com.taobao.taobao:id/sku_native_view_layout").findOne();
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
        function getCartPrice() {
            let textPrice = id("com.taobao.taobao:id/tv_charge_closingcost_price").findOne();
            let price = parseFloat(("" + textPrice.text()).substring(1));
            return price;
        }
        let cartPrice = -1;
        function upateCartPrice() {
            let price = getCartPrice();
            if (cartPrice != price) {
                let cartPriceLog = "已选合计: ￥" + price;
                priceCeiling = 0;
                if (ui.usePriceCeiling2.checked) priceCeiling = parseFloat((price * parseFloat(ui.priceCeiling2.getText())).toFixed(2));
                else if (ui.usePriceCeiling.checked) priceCeiling = parseFloat(ui.priceCeiling.getText());
                if (priceCeiling > 0) cartPriceLog += '，预定价格: ￥' + priceCeiling;
                console.log(cartPriceLog);
                cartPrice = price;
            }
        }
        function getPrice() {
            let purchaseBottom = id("com.taobao.taobao:id/purchase_bottom_layout").findOne();
            let heji = purchaseBottom.findOne(text("合计:"))
            let textPrice = heji.parent().child(heji.drawingOrder());
            //console.log("合计:" + textPrice.text());
            let price = parseFloat(("" + textPrice.text()).substring(1));
            //console.log("合计:" + price);
            return price;
        }
        function waitForPickOne() {
            let cart_recycler_view = id("com.taobao.taobao:id/cart_recycler_view").findOne();
            let hadChecked = cart_recycler_view.children().findOne(className("android.widget.CheckBox").depth(13).checked(true))
            if (hadChecked) return;
            console.log('自动勾选商品');
            let checkbox_first = cart_recycler_view.children().findOne(className("android.widget.CheckBox").depth(13));
            while (!checkbox_first.enabled()) {
                console.log('等待开团');
                swipe(device.width / 2 + (Math.random() * 50 - 25), device.height / 2 - Math.random() * 50,
                    device.width / 2 + (Math.random() * 50 - 25), device.height * 3 / 4 + Math.random() * 50, 350);
                sleep(rate);
                checkbox_first = cart_recycler_view.children().findOne(className("android.widget.CheckBox").depth(13));
            }
            if (!checkbox_first.checked()) checkbox_first.click();
        }
        function waitForTuan() {
            let cart_recycler_view = id("com.taobao.taobao:id/cart_recycler_view").findOne();
            let checkbox_charge = id("com.taobao.taobao:id/checkbox_charge").findOne();
            if (!checkbox_charge.checked()) checkbox_charge.click();
            while (1) {
                sleep(rate);
                swipe(device.width / 2 + (Math.random() * 50 - 25), device.height / 2 - Math.random() * 50,
                    device.width / 2 + (Math.random() * 50 - 25), device.height * 3 / 4 + Math.random() * 50, 350);
                while ((checkbox_charge = id("com.taobao.taobao:id/checkbox_charge").findOne()).checked()) { }
                checkbox_charge.click();
                let disableCheckBox = cart_recycler_view.children().findOne(className("android.widget.CheckBox").depth(13).enabled(false))
                if (disableCheckBox) {
                    console.log('等待开团');
                    continue;
                }
                upateCartPrice();
                while (cart_recycler_view.children().findOne(className("android.widget.CheckBox").depth(13).checked(false))) { }
                break;
            }
        }
        function autoBuy() {
            let tryCount = 0;
            let purchaseChanged = false;
            while (true) {
                if (tryCount > 0) {
                    if (Date.now() - buyTime > duration * 1000) { console.error('超出预定抢购时长'); return; }
                    sleep(rate);
                }
                tryCount++;

                if (step == 1) {
                    let ll_bottom_bar_content = id("com.taobao.taobao:id/ll_bottom_bar_content").findOne();
                    let btn = ll_bottom_bar_content.child(4).child(0);
                    while (btn.id() != "com.taobao.taobao:id/detail_main_sys_button") { btn = ll_bottom_bar_content.child(4).child(0); }
                    btn.click();
                    //autoSkus();
                    step = 2;
                }
                if (step == 2) {
                    id("com.taobao.taobao:id/confirm").findOne().click();
                    //id("confirm_text").textContains("购买").findOne().click();
                }
                if (step == 3) {
                    id("com.taobao.taobao:id/button_cart_charge").findOne().click();
                    //while (!id("com.taobao.taobao:id/purchase_bottom_layout").exists()) { }
                }
                let price = getPrice();
                console.log('当前价格：￥' + price);
                if (price <= 0) {
                    // 库存不足，进行捡漏
                    if (ui.takeLeftover.checked) {
                        console.warn('捡漏中...');
                        id("com.taobao.taobao:id/btn_back").findOnce().click();
                        if (way == 0) step = 3;
                        else step = 2;
                        //sleep(1000);
                        continue;
                    }
                    console.error('库存不足');
                    return;
                }
                if (ui.usePriceCeiling.checked || ui.usePriceCeiling2.checked) {
                    if (price > priceCeiling) {
                        console.warn('超出预定价格：￥' + priceCeiling);
                        id("com.taobao.taobao:id/btn_back").findOnce().click();
                        if (way == 0) step = 3;
                        else step = 2;
                        if (purchaseChanged) {
                            console.error('商品已恢复原价');
                            break;
                        }
                        continue;
                    }
                }
                click("提交订单");
                let success = false;
                while (true) {
                    //if (text("付款详情").exists()) {
                    if (text("确认交易").exists()) {
                        console.log("确认交易exists")
                        if (ui.autoPay.checked) pay();
                        success = true;
                        break;
                    }
                    let btn = id("com.taobao.taobao:id/purchase_new_dialog_right_btn").findOnce();
                    if (btn) {
                        console.log("购买信息变化")
                        console.error(id("com.taobao.taobao:id/purchase_new_dialog_desc").findOnce().text());
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
                    console.log("找不到确认交易")
                }
                if (success)
                    break;
            }
        }

        function startBuy() {
            try {
                console.show();
                let offsetTime = getOffsetTime();
                ui.timeInfo.setText('当前设备时间比淘宝网络' + (offsetTime.offset > 0 ? '慢了' : '快了') + Math.abs(offsetTime.offset) + 'ms，网络延迟 : ' + offsetTime.delay + 'ms');
                localOffsetTime = offsetTime.offset;
                console.log('脚本开始运行，当前时间偏移：' + offsetTime.offset + ' 网络延迟：' + offsetTime.delay);
                console.log('预计开时抢购时间为 ：' + ui.buyTime.getText());
                buyTime -= offsetTime.offset;

                if (buyTime + 300000 < Date.now()) {
                    console.error('超出预定抢购时长');
                    return;
                }
                buyTime -= rushTime;
                //autoSkus(); return;
                //pay(); return;
                while (true) {
                    let newStep = 0;
                    if (id("com.taobao.taobao:id/purchase_bottom_layout").exists()) {
                        newStep = 4;
                    }
                    else if (id("com.taobao.taobao:id/button_cart_charge").exists()) {
                        way = 0;
                        newStep = 3;
                    } else if (id("com.taobao.taobao:id/skupage_bottombar_layout").exists()) {
                        way = 1;
                        newStep = 2;
                    } else if (id("com.taobao.taobao:id/ll_bottom_bar_content").exists()) {
                        way = 1;
                        newStep = 1;
                    }
                    if (step != newStep) {
                        step = newStep;
                        if (step == 0) console.warn('未检测到相关页面，请前往购物车或商品页面');
                        if (step == 1) console.info('已进入商品页，脚本将自动选择商品属性并购买');
                        if (step == 2) console.info('已进入商品属性页，请手动选择商品属性，并设置好购买数量，脚本将自动购买');
                        if (step == 3) {
                            if (!ui.allCart.checked) console.info('已进入购物车，请勾选要抢购的商品，脚本将自动结算');
                            if (ui.allCart.checked) console.info('已进入购物车，请删除多余的商品，脚本将自动全选结算');
                            upateCartPrice();
                        }
                        if (step == 4) {
                            let price = getPrice();
                            console.info('已进入订单，合计: ' + price + '，脚本将自动提交订单');
                        }
                    }
                    // 30秒前
                    let countdown = buyTime - Date.now();
                    if (countdown > 3000) {
                        // 10秒一次防止息屏
                        if (Math.floor(countdown / 1000) % 10 == 0) {
                            //device.keepScreenDim(300000);
                            //device.keepScreenOn(300000);
                            //device.wakeUp();
                            click(0, device.height / 2);
                        }
                        if (step == 3) {
                            upateCartPrice();
                        } else if (step == 0 && countdown < 30000) {
                            // 强制打开购物车
                            console.log('强制打开购物车');
                            app.launchApp("手机淘宝");
                            desc("购物车").findOne().click();
                            sleep(5000);
                        }
                        sleep(1000);
                    } else {
                        if (step == 3) {
                            if (ui.allCart.checked) {
                                waitForTuan(); // 等待开团
                            } else {
                                upateCartPrice();
                                if (cartPrice <= 0)
                                    waitForPickOne(); //检查选购情况，如果没有自动选第一个
                            }
                        }
                        while (true) { if (buyTime - Date.now() <= 0) break; }
                        console.log('开始下单');
                        autoBuy();
                        break;
                    }
                }
            } catch (e) { console.error(e); }
        }
        threadBuy = threads.start(function () {
            startBuy();
            console.log('抢购结束');
            ui.ok.setText("开始抢购");
        });
    }
})

function getNetTime() {
    try {
        var res = http.get("http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp");
        var getTimestamp = res.body.json();
        return getTimestamp.data.t;
    } catch (e) { return Date.now(); }
}
function getOffsetTime() {
    let start = Date.now();
    var netTime = getNetTime();
    let end = Date.now();
    let delay = (end - start) * 0.5;
    let offset = netTime - start;
    return { offset: offset, delay: delay };
}

function init() {
    let offsetTime = getOffsetTime();
    //ui.timeInfo.setText(`当前设备时间比淘宝网络${offset > 0 ? ('慢了' + offset) : ('快了' + offset)}ms，网络延迟 : ${end - start}ms`);
    ui.timeInfo.setText('当前设备时间比淘宝网络' + (offsetTime.offset > 0 ? '慢了' : '快了') + Math.abs(offsetTime.offset) + 'ms，网络延迟 : ' + offsetTime.delay + 'ms');
}
threads.start(init);