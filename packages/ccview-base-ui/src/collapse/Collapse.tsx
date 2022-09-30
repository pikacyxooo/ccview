import { defineComponent, getCurrentInstance, provide } from 'vue';

export const COLLAPSE_KEY = Symbol('collapse');

export default defineComponent({
    
    setup(props, { slots }) {
        const parent = getCurrentInstance();

        const toggle = (name: String) => {
            console.log(name + 'is toggled')
        }

        provide(COLLAPSE_KEY, {
            parent,
            toggle
        })

        return () => (
            <div class="ccview-collapse">
                {slots.default?.()}
            </div>
        )
    }
})