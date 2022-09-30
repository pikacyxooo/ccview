import { defineComponent, getCurrentInstance, inject } from 'vue';
import { COLLAPSE_KEY  } from '../collapse/Collapse';

export default defineComponent({
    setup(props, {slots}) {
        const child = getCurrentInstance();
        inject(COLLAPSE_KEY, {
            
        })
        const clickItem = () => {
            console.log(child)
        }   
        return () => (
           <div class="collapse-item" onClick={clickItem}>
                {slots.default?.()}
           </div>
        )
    }
})