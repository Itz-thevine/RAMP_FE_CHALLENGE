import { useMemo } from "react"
import { TransactionsComponent } from "./types"

export const ApprovedTransaction: TransactionsComponent = ({
    transactions,
}) => {

    const approvedTransaction = useMemo(
        () => transactions?.filter(transaction => transaction.approved === true),
        [transactions]
    );

  return (
    <div>
        <div style={{margin: '0 0 10px 0'}}>
            <label className="RampText--s RampText--hushed">
                {'Approved Transaction'}
            </label>
        </div>
        <div style={{margin: '10px 0', display: 'flex', flexWrap: 'wrap'}}>
            {
                approvedTransaction?.map((transaction) => (
                    <div className="RampPane" key={transaction.id}>
                        <div className="RampPane--content">
                            <p className="RampText">{transaction.merchant} </p>
                            <b>{moneyFormatter.format(transaction.amount)}</b>
                            <p className="RampText--hushed RampText--s">
                            {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
