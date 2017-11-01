/**
 * 一品多规格
 */
class ProductSpec {
    constructor() {
        // 规格集合
        this.specs = null
        // 规格属性值对应的状态
        this.specValueStatus = null
        // 规格值笛卡尔组
        this.specValueGroup = {}
    }

    // 初始化规格数据
    init(goods) {
        this.initSpecs(goods)
        this.initSpecValueStatus()
        this.initSpecValueRelation(goods)
    }

    // 初始化商品规格
    initSpecs(goods) {
        this.log('start initSpecs')
        this.specs = new Map();
        for (const good of goods) {
            for (const spec in good) {
                if (spec !== 'id') {
                    let specValues = this.specs.get(spec)
                    if (specValues) {
                        specValues.add(good[spec])
                    } else {
                        this.specs.set(spec, new Set().add(good[spec]))
                    }
                }
            }
        }
        console.log('specs', this.specs);
    }

    // 初始化规格值得渲染状态
    initSpecValueStatus() {
        this.log('start initSpecValueStatus')
        this.specValueStatus = {};
        for (const [, v] of this.specs) {
            for (const specValue of v) {
                this.specValueStatus[specValue] = {
                    disabled: false,
                    selected: false
                }
            }
        }
        console.log('specValueStatus', this.specValueStatus);
    }

    // 初始化规格值映射关系
    initSpecValueRelation(goods) {
        let goodsSpecValues = {}
        for (const good of goods) {
            this.log('----- FOR -----');
            let specValues = []
            for (const spec in good) {
                if (spec !== 'id') {
                    let specValue = good[spec]
                    specValues.push(specValue)
                }
            }
            goodsSpecValues[good.id] = specValues
            console.log(specValues);

            this.recursiveSpecValueGroup(good.id, specValues, specValues[0])
        }
        console.log(goodsSpecValues);
    }

    // 递归规格值组合
    recursiveSpecValueGroup(goodId, specValues, originalFirst) { // ['A1', 'B1', 'C1', '']
        let len = specValues.length
        if (len === 1) { // 结束条件
            return
        }
        this.log('.')

        this.specValueGroup


        for (const specValue of specValues) {

            console.log(specValue);

        }


        let first = specValues.shift()
        specValues.push(first)
        if (len > 1 && specValues[0] === originalFirst) { // 结束条件
            return;
        }
        return this.recursiveSpecValueGroup(goodId, specValues, originalFirst)
    }

    // 选择规格值
    chooseSpecValue() {

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
