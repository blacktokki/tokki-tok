import { useMemo, useReducer } from "react"

type LocalSearchAction = {type:string, keyword?:string}

type LocalSearchState ={active:boolean, keyword:string}



const localSearchReducer =(initialState:LocalSearchState, action:LocalSearchAction)=>{
    switch (action.type){
        case 'SEARCH':
          return {
            ...initialState,
            keyword: action.keyword
          } as LocalSearchState
        case 'ENABLE_SEARCH':
          return {
            ...initialState,
            active:true,
          }
        case 'DISABLE_SEARCH':
            return{
                ...initialState,
                active:false,
                keyword: ''
            }
        default:
            throw new Error( `Unhandled action type: ${action.type}`)
    }
  }


export default function useLocalSearch<T>(target:T[], compare:(value:T, keyword:string)=>boolean) {
  const [searchState, dispatch] = useReducer(localSearchReducer, {active:false, keyword:''})
  const data = useMemo(()=>searchState.active?target.filter(v=>compare(v, searchState.keyword)):target, [searchState, target])
  return {searchState, dispatch, data}
}