import { ref, computed, ComponentInternalInstance, defineComponent, getCurrentInstance, inject, onUnmounted } from 'vue';
import { COLLAPSE_KEY  } from '../collapse/Collapse';

export type Numeric = number | string;

type ParentProvide = {
    link(child: ComponentInternalInstance): void;
    unlink(child: ComponentInternalInstance): void;
    internalChildren: ComponentInternalInstance[];
    toggle(index: Numeric, expanded: boolean):void;
    isExpanded(name: Numeric):boolean
}

export default defineComponent({
    setup(props, {slots}) {
        const child = getCurrentInstance()!;

        const parent = inject(COLLAPSE_KEY)
        if(!parent) {
            return;
        }
        const { link, unlink, internalChildren, toggle, isExpanded } = parent as ParentProvide;
        link(child);
        onUnmounted(()=>{
            unlink(child)
        })
        const index = computed(() => internalChildren.indexOf(child))
        const expanded = computed(() => {
            return isExpanded(index.value)
        })
       
        const clickItem = () => {
            toggle(index.value, expanded.value)
        }

        const getStyle = ()=>{
            return {
                color: expanded.value ? 'red' : 'black'
            }
        }

        return () => (
           <div class="collapse-item" style={getStyle()} onClick={clickItem}>
                {slots.default?.()}
           </div>
        )
    }
})