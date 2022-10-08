import { defineComponent, ref, reactive, watch } from "vue";
import { Collapse, CollapseItem } from "../../src";

export default defineComponent({
   
    setup() {
        const activeNames = ref(['1']);
        const list = ref(['aaa', 'bbb', 'ccc'])
        return () => 
            <Collapse v-model={activeNames.value}>
                {
                    list.value.forEach(item => {
                        <CollapseItem>{item}</CollapseItem>        
                    })
                }
            </Collapse>
    }
})