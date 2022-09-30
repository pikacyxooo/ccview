import { defineComponent } from "vue";
import { Collapse, CollapseItem } from "../../src";

export default defineComponent({
    setup() {
        return () => <>
            <Collapse>
                <CollapseItem>yoyo1</CollapseItem>
                <CollapseItem>yoyo2</CollapseItem>
                <CollapseItem>yoyo3</CollapseItem>
            </Collapse>
        </>
    }
})