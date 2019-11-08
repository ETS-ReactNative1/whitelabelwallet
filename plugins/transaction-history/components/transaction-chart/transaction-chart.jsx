import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart,
  useTheme,
} from '@codeparticle/whitelabelwallet.styleguide';

function TransactionChart ({
  transactions,
  minimumNumberOfChartPoints,
}) {
  const [chartDataPoints, setChartDataPoints] = useState([]);
  const theme = useTheme('wallet');

  const buildChartData = useCallback(
    async () => {
      if (transactions.length === 0) {
        return [];
      }

      const chronologicalTransactions = transactions.reverse();

      // Current balance is equal to the balance of the latest transaction.
      const currentBalance = chronologicalTransactions.length > 0
        ? chronologicalTransactions[chronologicalTransactions.length - 1].pending_balance
        : 0;

      // Create array of point coordinates using the chronologicalTransactions
      const chartData = chronologicalTransactions.map((transaction, index) => {
        return { x: index + 1, y: transaction.pending_balance };
      });

      // Check if we have enough transactions to build the chart, if so, set the chartData in state.
      if (chartData.length >= minimumNumberOfChartPoints) {
        setChartDataPoints(chartData);
        return;
      }

      // If not, calculate the number of remaining points to plot on the chart.
      const numberOfRemainingChartPoints = minimumNumberOfChartPoints - chronologicalTransactions.length;

      // Since there are not enough transactions over the last three months then we create point coordinates using the balance of the most recent transaction available.
      for (let counter = minimumNumberOfChartPoints - numberOfRemainingChartPoints; counter < minimumNumberOfChartPoints; counter++) {
        chartData.push({ x: counter, y: currentBalance });
      }

      setChartDataPoints(chartData);
    }, [transactions],
  );

  useEffect(() => {
    if (transactions.length > 0) {
      buildChartData();
    }
  }, [transactions, buildChartData]);

  return (
    <AreaChart
      colors={[theme.gradientStart, theme.gradientEnd]}
      data={chartDataPoints}
      padding={0}/>
  );
}

TransactionChart.prototypes = {
  colors: PropTypes.array,
  minimumNumberOfChartPoints: PropTypes.number,
  transactions: PropTypes.array.isRequired,
};

TransactionChart.defaultProps = {
  minimumNumberOfChartPoints: 6,
};

export { TransactionChart };