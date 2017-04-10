var MongoClient = require('mongodb').MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/mydb'; // 数据库为 mydb

// 关闭连接
var dbClose = function(db, result) {
    console.log('---------- Result ----------');
    console.log(result);
    db.close();
};

// 操作后回调
var operateCallback = function(err, result, callback) {
    if (err) {
        console.log('Error: ' + err);
        return;
    }
    callback(result);
};

// 新增
var insertData = function(db, callback) {
    // 连接到表 site
    var collection = db.collection('site');
    // 插入数据
    var data = [{
        'name': '菜鸟教程',
        'url': 'www.runoob.com'
    }, {
        'name': '百度',
        'url': 'www.baidu.com'
    }];

    collection.insert(data, function(err, result) {
        operateCallback(err, result, callback);
    });
};

// 查询
var selectData = function(db, callback) {
    // 连接到表
    var collection = db.collection('site');
    // 查询数据
    var whereStr = {
        'name': '百度'
    };
    collection.find(whereStr).toArray(function(err, result) {
        operateCallback(err, result, callback);
    })
};

// 修改
var updateData = function(db, callback) {
    // 连接到表
    var collection = db.collection('site');
    // 更新数据
    var whereStr = {
        'name': '百度'
    };
    var updateStr = {
        $set: {
            'url': 'https://www.baidu.com'
        }
    };
    collection.update(whereStr, updateStr, function(err, result) {
        operateCallback(err, result, callback);
    })
};

// 删除
var delData = function(db, callback) {
    // 连接到表
    var collection = db.collection('site');
    // 删除数据
    var whereStr = {
        'name': '菜鸟教程'
    };
    collection.remove(whereStr, function(err, result) {
        operateCallback(err, result, callback);
    });
};

// 连接mongodb
MongoClient.connect(DB_CONN_STR, function(err, db) {
    console.log('连接成功！');
    insertData(db, function(result) {
        dbClose(db, result);
    });

    // selectData(db, function(result) {
    //     dbClose(db, result);
    // });

    // updateData(db, function(result) {
    //     dbClose(db, result);
    // });
    //
    // delData(db, function(result) {
    //     dbClose(db, result);
    // });
});
