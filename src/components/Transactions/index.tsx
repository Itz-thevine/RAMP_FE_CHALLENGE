import { useCallback } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction } from "./types"

interface TransactionProps {
  transactions: any[]; // Adjust the type according to your data structure
  setTransactions: React.Dispatch<React.SetStateAction<any[]>>;
}


export const Transactions: React.FC<TransactionProps> = ({ transactions, setTransactions }) => {
  const { fetchWithoutCache, loading } = useCustomFetch()

  const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
    async ({ transactionId, newValue }) => {
      await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
        transactionId,
        value: newValue,
      })
      setTransactions(prevTransactions => {
        return prevTransactions.map(transaction => {
          if (transaction.id === transactionId) {
            return { ...transaction, approved: newValue };
          }
          return transaction;
        });
      });

    },
    [fetchWithoutCache, setTransactions]
  )

  if (transactions === null || transactions?.length === 0) {
    return <div className="RampLoading--container">Loading...</div>
  }
    console.log(transactions)
  return (
    <div data-testid="transaction-container">
      <div style={{margin: '0 0 10px 0'}}>
          <label className="RampText--s RampText--hushed">
              {'All'}
          </label>
      </div>
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          loading={loading}
          setTransactionApproval={setTransactionApproval}
        />
      ))}
    </div>
  )
}
