import './demo.scss'
import specsData from './data-specs.js'
import ProductSpec from './product-spec.js'

let myProductSpec = null;
let vm = new Vue({
    el: '#app',
    data: {
        specs: null, // 约定的规格数据
        specValueStatus: {}, // 规格值对应的渲染状态集合
        selectedCommodityId: 0, // 选择完成后对应的唯一货品id
        selectedSpecValueArr: null, // 已选择的规格值文本数组
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
            myProductSpec.chooseSpecOption(specKey, specOption, this)
        },
    }
})

vm.init()
