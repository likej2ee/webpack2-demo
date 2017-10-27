import './demo.scss'
import specsData from './data-specs.js'
import ProductSpec from './product-spec.js'
let myProductSpec = null;
let vm = new Vue({
    el: '#app',
    data: {
        selectedCommodityId: 0, // 选择完成后对应的唯一货品id
        specs: null, // 约定的规格数据
        specValueStatus: null, // 规格值对应的渲染状态集合
        selectedSpecMap: {}, // 已选择的规格Map
        selectedSpecValueTextArr: null, // 已选择的规格值文本数组
        unselectedSpecKeyArr: null, // 未选择的规格键名称文本数组
    },
    computed: {},
    methods: {
        init() {
            myProductSpec = new ProductSpec()
            myProductSpec.init(specsData)
            this.specValueStatus = myProductSpec.specValueStatus
            this.specs = specsData
        },
        // 选择规格选项
        chooseSpecOption(specKey, specOption) {
            if (this.specValueStatus[specOption.specValue].selected) return
            let value = this.selectedSpecMap[specKey]
            if (value) {
                // 将已经存在的相同规格的选项值重置为非选择
                this.specValueStatus[value.specValue].selected = false
            }
            // 将当期选择的规格值选中
            this.specValueStatus[specOption.specValue].selected = true;
            // 记录当期规格值到已选择规格集合中
            this.selectedSpecMap[specKey] = specOption

            myProductSpec.chooseSpecOption(this.selectedSpecMap, (skuIntersectionLength) => {
                if (skuIntersectionLength === 0) { // 如果交集后的sku数是0，则需要再次触发规格值选择
                    this.chooseSpecOption(specKey, specOption)
                }
                this.selectedSpecValueTextArr = myProductSpec.getSelectedSpecValueTextArr(this.selectedSpecMap)
                this.unselectedSpecKeyArr = myProductSpec.getUnselectedSpecKeyArr(this.selectedSpecMap)
                // 规格选项选择完成
                if (this.unselectedSpecKeyArr.length === 0) {
                    let selectedCommodityId = myProductSpec.getCommodityId(this.selectedSpecValueTextArr)
                    this.selectedCommodityId = selectedCommodityId
                }
            })
        },
    }
})

vm.init()
