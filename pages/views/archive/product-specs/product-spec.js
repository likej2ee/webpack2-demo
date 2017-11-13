/**
 * 一品多规格
 */
class ProductSpec {
    constructor() {
        // 规格集合，与服务器约定好的数据结构，初始化后追加到vm上
        this.specs = null
        // 规格值对应的状态，初始化后追加到vm上
        this.specValueStatus = null
        // 规格键名称顺序数组
        this.specKeysOrder = []
        // 规格选项组合为索引，所有符合的货品为值得集合
        this.specOptionGroupForAllSKUMap = new Map()
        // 已选择的规格选项
        this.selectedSpecMap = {}
    }

    // 初始化规格数据
    init(specs) {
        this.specs = specs
        this.initSpecKeysOrder()
        this.initSpecValueStatus()
        this.initSpecOptionGroupForAllSKUMap()
    }

    // 初始化规格选项与货品的对应关系
    initSpecOptionGroupForAllSKUMap() {
        this.log('start initSpecOptionGroupForAllSKUMap')
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

        // 规格选项组合与满足条件的skuId的集合
        for (const [skuId, specOptions] of skuMap) {
            let specOptionGroupForSigleSKUMap = this.getSpecOptionGroupForSigleSKU(specOptions, skuId)
            for (const [k, v] of specOptionGroupForSigleSKUMap) {
                let skuIds = this.specOptionGroupForAllSKUMap.get(k)
                if (skuIds) {
                    this.specOptionGroupForAllSKUMap.set(k, skuIds.add(v))
                } else {
                    this.specOptionGroupForAllSKUMap.set(k, new Set([v]))
                }
            }
        }
        console.log(this.specOptionGroupForAllSKUMap);
    }

    // 获取规格选项的各种组合为key的集合
    getSpecOptionGroupForSigleSKU(specOptions, skuId, result = new Map()) {
        // this.log('start specOptionGroupForSigleSKU')
        if (specOptions.length === 0) {
            console.log('result', result);
            // this.log('end specOptionGroupForSigleSKU')
            return result
        }

        if (result.size === 0) {
            for (const specOption of specOptions) {
                result.set(specOption, skuId)
            }
        } else {

            // 复制一份结果集
            let resultCopy = new Map()
            for (const [k, v] of result) {
                resultCopy.set(k, v)
            }

            // 循环拼接key值
            for (const [key] of resultCopy) {
                let arr = key.split(',')
                let lastOption = arr[arr.length - 1]
                let i = 0;
                let startPos = specOptions.indexOf(lastOption)

                for (const specOption of specOptions) {
                    // 索引开始位置需要大于拼接key中最后一个选项所在规格里的索引
                    if (i <= startPos) {
                        i++
                        continue
                    }
                    result.set(key + ',' + specOption, skuId)
                }
            }
        }
        specOptions.shift()
        return this.getSpecOptionGroupForSigleSKU(specOptions, skuId, result)
    }

    // 初始化规格名称的顺序数组
    initSpecKeysOrder() {
        this.log('start initSpecKeysOrder')
        for (const o of this.specs) {
            this.specKeysOrder.push(o.displayName)
        }
    }

    // 初始化规格值的渲染状态
    initSpecValueStatus() {
        this.log('start initSpecValueStatus')
        this.specValueStatus = {};
        for (const spec of this.specs) {
            for (const o of spec.specOptions) {
                this.specValueStatus[o.specValue] = {
                    specKeyOrder: this.specKeysOrder.indexOf(spec.displayName),
                    disabled: false,
                    selected: false
                }
            }
        }
    }

    // 校验规格是否已选择完整
    checkSpecSelectedComplete(vm) {
        return vm.selectedSpecValueArr.length === this.specKeysOrder.length
    }

    // 选择规格选项
    chooseSpecOption(specKey, specOption, vm) {
        // 若已是选中状态则不做处理
        if (this.specValueStatus[specOption.specValue].selected) return
        // 更新相同规格的不同选项的选择互斥
        let value = this.selectedSpecMap[specKey]
        if (value) {
            // 将已经存在的相同规格的选项值重置为非选择
            this.specValueStatus[value.specValue].selected = false
        }
        // 将当前选择的规格值选中
        this.specValueStatus[specOption.specValue].selected = true;
        // 记录当前规格值到已选择规格集合中
        this.selectedSpecMap[specKey] = specOption

        // 获取已选择的规格选项值数组
        vm.selectedSpecValueArr = this.getSelectedSpecValueArr(this.selectedSpecMap)
        vm.unselectedSpecKeyArr = this.getUnselectedSpecKeyArr(this.selectedSpecMap)

        if (this.isNeedReelect(specKey, specOption, vm)) return

        // 渲染其他规格选项
        this.renderedOtherSpecOptions(this.selectedSpecMap)
        // 刷新所选规格的数据
        this.refreshCommodityData(vm)
    }

    // 拉取所选规格的货品数据
    refreshCommodityData(vm) {
        if (!this.checkSpecSelectedComplete(vm)) {
            vm.selectedCommodityId = 0
            return
        }
        vm.selectedCommodityId = this.getCommodityId(vm.selectedSpecValueArr)
    }

    // 获取满足规则选项的sku集合
    isNeedReelect(specKey, specOption, vm) {
        // 获取符合条件的sku集合
        let skuIds = this.specOptionGroupForAllSKUMap.get(vm.selectedSpecValueArr.toString())

        // 若当前所选组合没有符合条件的sku，则回到起点重新执行
        if (typeof skuIds === 'undefined') {
            this.log('needReelect')
            this.selectedSpecMap = {}
            // 重置规格选项状态值
            for (const specValue in this.specValueStatus) {
                let statusObj = this.specValueStatus[specValue]
                statusObj.selected = false
                if (specOption.specValue === specValue) {
                    statusObj.disabled = false
                }
            }
            this.chooseSpecOption(specKey, specOption, vm)
        }

        return !skuIds // 无符合条件的sku时需要重新执行选项选择
    }

    // 渲染其他规格选项
    renderedOtherSpecOptions(selectedSpecMap) {
        this.log('start renderedOtherSpecOptions')
        // 已选择的选项按规格顺序的数组，规格未选择的空占位
        let selectedSpecValueOrderArr = new Array(this.specKeysOrder.length)
        for (const specKey in selectedSpecMap) {
            let index = this.specKeysOrder.indexOf(specKey)
            selectedSpecValueOrderArr[index] = selectedSpecMap[specKey].specValue
        }

        // 其他选项与当前所选规格选项组合后校验是否存在sku，有则可选，无则置灰
        for (const specvalue in this.specValueStatus) {
            let selectedSpecValueArrCopy = [].concat(selectedSpecValueOrderArr)
            let statusObj = this.specValueStatus[specvalue]
            if (statusObj.selected) continue

            selectedSpecValueArrCopy.splice(statusObj.specKeyOrder, 1, specvalue)
            console.log('组合选项后的值', selectedSpecValueArrCopy);

            let specValueGroupNoEmpty = this.trimEmptySpecValue(selectedSpecValueArrCopy)
            let optionalSkuIds = this.specOptionGroupForAllSKUMap.get(specValueGroupNoEmpty.toString())

            statusObj.disabled = !optionalSkuIds
        }
        this.log('end renderedOtherSpecOptions')
    }

    // 去除空数据
    trimEmptySpecValue(arr) {
        let result = []
        for (const specValue of arr) {
            if (specValue) {
                result.push(specValue)
            }
        }
        return result
    }

    // 获取所选规格的skuId
    getCommodityId(selectedSpecValueArr) {
        let skuIds = this.specOptionGroupForAllSKUMap.get(selectedSpecValueArr.toString())
        return [...skuIds][0]
    }

    // 获取已选择的属性值数组
    getSelectedSpecValueArr(selectedSpecMap) {
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
