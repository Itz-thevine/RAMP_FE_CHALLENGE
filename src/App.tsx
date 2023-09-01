import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  const [transactions, setTransactions] = useState<any>(null)
  const [filterAll, setfilterAll] = useState(true)

  const trans = useMemo(() => {
    const paginatedData = paginatedTransactions?.data ?? [];
    const employeeData = transactionsByEmployee ?? [];
  
    if(filterAll) {
      if(paginatedTransactions?.nextPage === null || (paginatedTransactions?.nextPage && paginatedTransactions.nextPage !== 1)){
        return setTransactions((prevState: any[]) => [
          ...prevState, 
          ...paginatedData, 
          ...employeeData
        ]);
      }else{
        return setTransactions([...paginatedData]);
      }
    }else{
      return setTransactions([
        ...employeeData
      ]);
    }
    
  }, [paginatedTransactions, transactionsByEmployee]);

  useEffect(() => trans, [trans])

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()

    await employeeUtils.fetchAll()
    setIsLoading(false)
    await paginatedTransactionsUtils.fetchAll()

  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      
      if(employeeId !== ''){
        await transactionsByEmployeeUtils.fetchById(employeeId)
      }else{
        await employeeUtils.fetchAll()
        await paginatedTransactionsUtils.fetchAll()
      }
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils, employeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            const currentFilter = `${newValue?.firstName} ${newValue?.lastName}`
            if(currentFilter !== 'All Employees') {
              setfilterAll(false)
            }else{
              setfilterAll(true)
            }

            if (newValue === null) {
              return
            }

            await loadTransactionsByEmployee(newValue.id)
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} setTransactions={setTransactions} />

          {(transactions !== null && filterAll && paginatedTransactions?.nextPage !== null) ? (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading}
              onClick={async () => {
                await loadAllTransactions()
              }}
            >
              View More
            </button>
          ):(
            <div></div>
          )}
        </div>
      </main>
    </Fragment>
  )
}
