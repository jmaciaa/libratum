import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import Loader from 'Components/Loader';
import Table from 'Components/table';
import Avatar from 'Components/Avatar';

import Container from 'Layout/Container';

const NoSSRComponent = dynamic(
  () => import('Components/chart/noSSRComponent'),
  {
    ssr: false,
  }
);

export default function Dashboard() {
  // TODO: Refactor the state to use it globally in the frontend
  const [balance, setBalance] = useState([]);
  const [currencies, setCurrencies] = useState([]); // TODO: Use GraphQL in the server to return the currency data inside the balance
  const [isLoading, setLoading] = useState(true);
  const [date] = useState(new Date());
  const [funFact, setFunFact] = useState(null);

  const dayIncrease = -4;
  const monthIncrease = 5;
  const YTDIncrease = 20;

  const getFunFact = () => {
    return fetch('https://uselessfacts.jsph.pl/random.json?language=en')
      .then((res) => res.json())
      .then((response) => setFunFact(response.text));
  };

  useEffect(() => {
    getFunFact();
  }, []);

  useEffect(() => {
    const url = `http://localhost:3001/dashboard?userId=${1}`; // Llamar solo OnLogin
    if (!balance.length) {
      fetch(url)
        .then((res) => res.json())
        .then((response) => {
          setBalance(response.balances);
          setCurrencies(response.currencies);
          setLoading(false);
        })
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Libratum dashboard</title>
      </Head>
      <div className="dashboard">
        <Container
          widthPercentage={90}
          heightPercentage={70}
          isLoading={false}
          additionalCss={`grid-row: 1; 
          background: transparent; box-shadow: none`}
        >
          <div className="welcome">
            <Avatar alt="avatar" height={60} width={60} />
            <div>
              <h2>Welcome Erik!</h2>
              <p className="date">{`${date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}`}</p>
            </div>
            {!funFact ? (
              <div className="loader">
                <Loader />
              </div>
            ) : (
              <div className="funFact">
                <h2>Did you know...</h2>
                <p>{funFact}</p>
              </div>
            )}
          </div>
        </Container>
        <Container
          widthPercentage={90}
          heightPercentage={70}
          isLoading={false}
          additionalCss={`grid-row: 2;`}
        >
          {isLoading ? (
            <div className="loader">
              <Loader />
            </div>
          ) : (
            <div className="realized">
              <div className="second-container">
                <h2>24h increase</h2>
                {dayIncrease >= 0 ? (
                  <p className="green">{dayIncrease}%</p>
                ) : (
                  <p className="red">{dayIncrease}%</p>
                )}
              </div>
              <div className="second-container">
                <h2>Month increase</h2>
                {monthIncrease >= 0 ? (
                  <p className="green">{monthIncrease}%</p>
                ) : (
                  <p className="red">{monthIncrease}%</p>
                )}
              </div>
              <div className="second-container">
                <h2>YTD increase</h2>
                {YTDIncrease >= 0 ? (
                  <p className="green">{YTDIncrease}%</p>
                ) : (
                  <p className="red">{YTDIncrease}%</p>
                )}
              </div>
            </div>
          )}
        </Container>
        <Container
          widthPercentage={90}
          heightPercentage={90}
          isLoading={isLoading}
          title="holdings"
          additionalCss={`grid-row: 3 / span 3; grid-column: 1 `}
        >
          {isLoading ? (
            <div className="loader">
              <Loader />
            </div>
          ) : (
            <Table />
          )}
        </Container>
        <Container
          widthPercentage={90}
          heightPercentage={95}
          isLoading={false}
          additionalCss={`grid-row: 1 / -1`}
        >
          {isLoading ? (
            <div className="loader">
              <Loader />
            </div>
          ) : (
            <NoSSRComponent data={balance} moreData={currencies} />
          )}
        </Container>
      </div>
      <style jsx>{`
        .dashboard {
          width: 100vw;
          height: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(5, minmax(100px, 1fr));
          justify-items: center;
          align-items: center;
        }

        .loader {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }

        .classContainer {
          display: grid;
        }

        .classContainer:last-child {
          margin: none;
        }

        .realized {
          height: 100%;
          display: flex;
          justify-content: space-evenly;
        }

        .second-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        h2 {
          font-size: 1.5em;
          text-transform: uppercase;
          justify-self: flex-start;
        }

        .green {
          color: green;
        }

        .red {
          color: red;
        }

        .welcome {
          height: 100%;
          width: 100%;
          display: flex;
          padding: 0 1em;
          align-items: center;
        }

        .welcome > div:nth-child(2) {
          margin-left: 1em;
          min-width: 186px;
        }
        .welcome > div:nth-child(3) {
          max-width: 500px;
          margin-left: 100px;
        }

        .date {
          color: grey;
          font-size: 12px;
        }

        .funFact > h2 {
          font-size: 1em;
        }

        .funFact > p {
          color: grey;
          font-size: 12px;
        }
      `}</style>
    </>
  );
}
