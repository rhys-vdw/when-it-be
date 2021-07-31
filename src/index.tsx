import { format } from "date-fns";
import { Component, render, h, Fragment } from "preact";
import queryString from "query-string";

function dateToString(d: Date) {
  return Math.floor(d.getTime() / 60).toString(36);
}

function stringToDate(s: string) {
  return new Date(parseInt(s, 36) * 60);
}

function splitDateAndTime(date: Date) {
  return [format(date, "yyyy-LL-dd"), format(date, "HH:mm")];
}
function joinDateAndTime(dateString: string, timeString: string) {
  return new Date(dateString + "T" + timeString);
}

interface CreateProps {
  date: Date;
  onSubmit: (date: Date) => void;
}

interface CreateState {
  timeString: string;
  dateString: string;
}

class Create extends Component<CreateProps, CreateState> {
  state = {
    timeString: "",
    dateString: "",
  };

  componentDidMount() {
    const { date } = this.props;
    const [dateValue, timeValue] = splitDateAndTime(date);
    this.setState({
      dateString: dateValue,
      timeString: timeValue,
    });
  }

  private handleSubmit = () => {
    const { dateString, timeString } = this.state;
    this.props.onSubmit(joinDateAndTime(dateString, timeString));
  };

  private handleTimeChange = (event: Event) => {
    this.setState({ timeString: (event.target as HTMLInputElement).value });
  };

  private handleDateChange = (event: Event) => {
    console.log({ change: (event.target as HTMLInputElement).value });
    this.setState({ dateString: (event.target as HTMLInputElement).value });
  };

  render() {
    const { timeString, dateString } = this.state;
    return (
      <form id="create" onSubmit={this.handleSubmit}>
        <div>
          <input
            onChange={this.handleDateChange}
            type="date"
            value={dateString}
            required
          />
        </div>
        <div>
          <input
            onChange={this.handleTimeChange}
            type="time"
            value={timeString}
            required
          />
        </div>
        <div>
          <button>set</button>
        </div>
      </form>
    );
  }
}

interface ShowProps {
  date: Date;
  heading: string | null;
  onChangeTime: () => void;
}

function Show({ date, heading, onChangeTime }: ShowProps) {
  const [dateString, timeString] = splitDateAndTime(date);
  console.log({ date, dateString, timeString });
  return (
    <>
      <main id="show">
        {heading !== null && heading.trim() !== "" && (
          <header id="header" style="display: none">
            <h1 id="heading">{heading}</h1>
            <p id="at">
              {Date.now() > date.getTime() ? "was at" : "will be at"}
            </p>
          </header>
        )}
        <div>
          <time id="time" dateTime={timeString}>
            {format(date, "hh:mm")}
          </time>
          <span id="period">{format(date, "a")}</span>
        </div>
        <time id="date" dateTime={dateString}>
          {format(date, "EEEE, do MMMM, yyyy")}
        </time>
        <p id="tz"></p>
      </main>
      <footer id="footer">
        <a href="javascript:void 0" onClick={onChangeTime}>
          change time
        </a>
      </footer>
    </>
  );
}

interface MainState {
  event: string | null;
  date: Date;
  isCreateVisible: boolean;
}

class Main extends Component<{}, MainState> {
  state: MainState = {
    event: null,
    date: new Date(),
    isCreateVisible: false,
  };

  private handleSubmit = (date: Date) => {
    this.setState({ isCreateVisible: false, date });
    window.location.search = `?t=${dateToString(date)}`;
  };

  private handleChangeTime = () => {
    window.location.search = "";
    this.setState(({ isCreateVisible }) => ({
      isCreateVisible: !isCreateVisible,
    }));
  };

  componentDidMount() {
    const { t, e } = queryString.parse(location.search) as {
      t?: string;
      e?: string;
    };
    const date = (t && stringToDate(t)) || null;
    this.setState((s) => ({
      event: e || null,
      date: date || s.date,
      isCreateVisible: date === null || isNaN(date.getTime()),
    }));
  }

  render() {
    const { date, event, isCreateVisible } = this.state;
    return isCreateVisible ? (
      <Create date={date} onSubmit={this.handleSubmit} />
    ) : (
      <Show heading={event} date={date} onChangeTime={this.handleChangeTime} />
    );
  }
}

render(<Main />, document.body);
