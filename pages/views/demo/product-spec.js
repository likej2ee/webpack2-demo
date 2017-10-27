/**
 * 一品多规格
 */
class ProductSpec {
    constructor() {
        // 规格集合，与服务器约定好的数据结构
        this.specs = null
        // 规格键名称顺序数组
        this.specKeysOrder = null
        // 规格值对应的状态
        this.specValueStatus = null
        // 规格选项与货品的关系
        this.specOptionSKUMap = null
    }

    // 初始化规格数据
    init(specs) {
        this.specs = specs
        this.initSpecOptionSKUMap()
        this.initSpecKeysOrder()
        this.initSpecValueStatus()
    }

    // 初始化规格选项与货品的对应关系
    initSpecOptionSKUMap() {
        this.log('start initSpecOptionSKUMap')
        this.specOptionSKUMap = {}
        let skuMap = new Map()
        for (const o of this.specs) {
            for (const specOption of o.specOptions) {
                for (const commodityId of specOption.commodityIds) {
                    let specOptionList = skuMap.get(commodityId)
                    if (specOptionList) {
                        specOptionList.push(specOption.specValue)
                    } else {
                        skuMap.set(commodityId, [specOption.specValue])
                    }
                }
            }
        }
        // 翻转键值对
        for (const [sku, specValue] of skuMap) {
            this.specOptionSKUMap[specValue] = sku
        }
    }

    initSpecKeysOrder() {
        this.log('start initSpecKeysOrder')
        this.specKeysOrder = []
        for (const o of this.specs) {
            this.specKeysOrder.push(o.displayName)
        }
    }

    // 初始化规格值得渲染状态
    initSpecValueStatus() {
        this.log('start initSpecValueStatus')
        this.specValueStatus = {};
        for (const spec of this.specs) {
            for (const o of spec.specOptions) {
                this.specValueStatus[o.specValue] = {
                    disabled: false,
                    selected: false
                }
            }
        }
    }

    // 根据选择完成的规格选项获取唯一货品id
    getCommodityId(selectedSpecValueTextArr) {
        return this.specOptionSKUMap[selectedSpecValueTextArr]
    }

    // 选择规格值
    chooseSpecOption(selectedSpecMap, done) {
        this.log('start chooseSpecValue')
        let skuIntersection = [] // sku取交集
        let count = 0; // 循环计数
        for (const specKey in selectedSpecMap) {
            let value = selectedSpecMap[specKey]
            if (skuIntersection.length === 0 && count === 0) {
                skuIntersection = skuIntersection.concat(value.commodityIds)
            } else {
                skuIntersection = this.arrayIntersection(skuIntersection, value.commodityIds)
            }
            count++
        }

        console.log('selectedSpecMap', selectedSpecMap);
        console.log('skuIntersection', skuIntersection);

        for (const spec of this.specs) {
            for (const o of spec.specOptions) {
                let noSku = true
                for (const sku of o.commodityIds) {
                    if (skuIntersection.indexOf(sku) > -1) {
                        noSku = false
                        break
                    }
                }

                if (noSku) {
                    this.specValueStatus[o.specValue].disabled = true
                    // 清理已选择的规格值
                    if (this.specValueStatus[o.specValue].selected) {
                        this.log('之前选择', o.specValue);
                        delete selectedSpecMap[spec.displayName]
                        this.specValueStatus[o.specValue].selected = false
                    }
                } else {
                    this.specValueStatus[o.specValue].disabled = false
                }
            }
        }
        done(skuIntersection.length)
        this.log('end chooseSpecValue')
    }

    // 获取已选择的属性值数组
    getSelectedSpecValueTextArr(selectedSpecMap) {
        let result = []
        let selectedSpecValueArr = this.getSortSpecValue(selectedSpecMap)
        for (const o of selectedSpecValueArr) {
            result.push(o.specValue)
        }
        return result
    }

    // 设置未选择的规格键名称
    getUnselectedSpecKeyArr(selectedSpecMap) {
        let result = []
        for (const specKey of this.specKeysOrder) {
            if (typeof selectedSpecMap[specKey] === 'undefined') {
                result.push(specKey)
            }
        }
        return result
    }

    // 根据规则键名称顺序排序
    getSortSpecValue(selectedSpecMap) {
        let result = []
        for (const k in selectedSpecMap) {
            selectedSpecMap[k].specKeysOrder = this.specKeysOrder.indexOf(k)
            result.push(selectedSpecMap[k])
        }
        // 数组长度大于1是需要按照规格名称顺序排序
        if (result.length > 1) {
            result.sort((o1, o2) => {
                return o1.specKeysOrder - o2.specKeysOrder
            })
        }
        return result
    }

    // 获取sku数组交集
    arrayIntersection(a, b) {
        a.sort()
        b.sort()
        var ai = 0,
            bi = 0;
        var result = new Array();
        while (ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                ai++;
            } else if (a[ai] > b[bi]) {
                bi++;
            } else /* they're equal */ {
                result.push(a[ai]);
                ai++;
                bi++;
            }
        }
        return result;
    }

    // 打印日志
    log() {
        let params = [...arguments]
        let message = []
        for (const param of params) {
            if (typeof param === 'object') {
                message.push(JSON.stringify(param))
            } else {
                message.push(param)
            }
        }
        let messageStr = message.join(' ')
        console.log('%c' + messageStr, 'color: green; font-size: 15px;');
    }
}

export default ProductSpec
