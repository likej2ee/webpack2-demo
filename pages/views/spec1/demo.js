import './demo.scss'
import ProductSpec from './product-spec.js'
import goods from './data-goods.js'

let vm = new Vue({
    el: '#app',
    data: {
        specs: new Map(),
        specValueStatus: new Map()
    },
    computed: {
        convertSpecs() {
            let result = {}
            for (const [k, v] of this.specs) {
                result[k] = [...v]
            }
            return result
        }
    },
    methods: {
        init() {
            let myProductSpec = new ProductSpec()
            myProductSpec.init(goods)
            this.specs = myProductSpec.specs
            this.specValueStatus = myProductSpec.specValueStatus
        },
        chooseSpecValue(specValue) {
            console.log('已选择的规格值', specValue);
            this.specValueStatus[specValue].selected = true;
        }
    }
})

vm.init()
