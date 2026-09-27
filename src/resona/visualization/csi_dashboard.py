"""
Real-time CSI monitoring dashboard using Plotly Dash.
"""

from pathlib import Path

import dash
import pandas as pd
import plotly.graph_objs as go
from dash import dcc, html
from dash.dependencies import Input, Output


class CSIDashboard:
    """Interactive dashboard for CSI monitoring."""

    def __init__(self, audit_log_dir: Path):
        self.audit_log_dir = audit_log_dir
        self.app = dash.Dash(__name__)
        self._setup_layout()
        self._setup_callbacks()

    def _setup_layout(self) -> None:
        """Define dashboard layout."""

        self.app.layout = html.Div(
            [
                html.H1(
                    "Resona CSI Monitor",
                    style={"textAlign": "center", "color": "#2c3e50"},
                ),
                html.Div(
                    [
                        html.Div(
                            [
                                html.H3("Current CSI Status"),
                                html.Div(id="csi-status-indicator"),
                            ],
                            className="four columns",
                        ),
                        html.Div(
                            [
                                html.H3("Latest CSI Value"),
                                html.Div(
                                    id="csi-value-display",
                                    style={"fontSize": 48, "fontWeight": "bold"},
                                ),
                            ],
                            className="four columns",
                        ),
                        html.Div(
                            [
                                html.H3("Action Required"),
                                html.Div(id="action-display"),
                            ],
                            className="four columns",
                        ),
                    ],
                    className="row",
                ),
                html.Hr(),
                # CSI time series
                dcc.Graph(id="csi-timeseries"),
                # Dimension breakdown
                dcc.Graph(id="dimension-slopes"),
                # Attractor activations
                dcc.Graph(id="attractor-activations"),
                # Auto-refresh interval
                dcc.Interval(
                    id="interval-component", interval=5 * 1000, n_intervals=0
                ),
            ]
        )

    def _setup_callbacks(self) -> None:
        """Define interactive callbacks."""

        @self.app.callback(
            [
                Output("csi-status-indicator", "children"),
                Output("csi-status-indicator", "style"),
                Output("csi-value-display", "children"),
                Output("csi-value-display", "style"),
                Output("action-display", "children"),
                Output("csi-timeseries", "figure"),
                Output("dimension-slopes", "figure"),
                Output("attractor-activations", "figure"),
            ],
            [Input("interval-component", "n_intervals")],
        )
        def update_dashboard(n):
            # Load latest CSI data
            csi_df = self._load_csi_logs()

            if csi_df.empty:
                return self._empty_dashboard()

            latest = csi_df.iloc[-1]
            csi_value = latest["data"]["csi"]
            status = latest["data"]["status"]
            action = latest["data"]["action"]

            # Status indicator styling
            status_colors = {
                "HEALTHY_POSITIVE": "#27ae60",
                "STABLE_LOW": "#f39c12",
                "WARNING_NEGATIVE_DRIFT": "#e67e22",
                "CRITICAL_NEGATIVE_DRIFT": "#e74c3c",
            }

            status_style = {
                "backgroundColor": status_colors.get(status, "#95a5a6"),
                "color": "white",
                "padding": "20px",
                "borderRadius": "10px",
                "textAlign": "center",
                "fontSize": "24px",
                "fontWeight": "bold",
            }

            csi_value_style = {
                "color": status_colors.get(status, "#95a5a6"),
                "textAlign": "center",
            }

            # Generate figures
            csi_fig = self._plot_csi_timeseries(csi_df)
            dim_fig = self._plot_dimension_slopes(csi_df)
            att_fig = self._plot_attractor_activations()

            return (
                status,
                status_style,
                f"{csi_value:.4f}",
                csi_value_style,
                action,
                csi_fig,
                dim_fig,
                att_fig,
            )

    def _load_csi_logs(self) -> pd.DataFrame:
        """Load CSI log data."""
        log_file = self.audit_log_dir / "csi_log.jsonl"
        if not log_file.exists():
            return pd.DataFrame()

        return pd.read_json(log_file, lines=True)

    def _plot_csi_timeseries(self, df: pd.DataFrame) -> go.Figure:
        """Plot CSI over time."""

        timestamps = pd.to_datetime(df["timestamp"])
        csi_values = df["data"].apply(lambda x: x["csi"])

        fig = go.Figure()
        fig.add_trace(
            go.Scatter(
                x=timestamps,
                y=csi_values,
                mode="lines+markers",
                name="CSI",
                line=dict(color="#3498db", width=2),
            )
        )

        # Add threshold lines
        fig.add_hline(
            y=0, line_dash="dash", line_color="gray", annotation_text="Zero Line"
        )
        fig.add_hline(
            y=-0.01,
            line_dash="dot",
            line_color="orange",
            annotation_text="Warning Threshold",
        )
        fig.add_hline(
            y=-0.05,
            line_dash="dot",
            line_color="red",
            annotation_text="Critical Threshold",
        )

        fig.update_layout(
            title="Coherence Slope Index Over Time",
            xaxis_title="Time",
            yaxis_title="CSI (dC/dt)",
            hovermode="x unified",
        )

        return fig

    def _plot_dimension_slopes(self, df: pd.DataFrame) -> go.Figure:
        """Plot per-dimension coherence slopes."""

        latest = df.iloc[-1]["data"]["dimension_slopes"]

        dimensions = list(latest.keys())
        slopes = [latest[d] for d in dimensions]
        colors = ["#27ae60" if s > 0 else "#e74c3c" for s in slopes]

        fig = go.Figure(data=[go.Bar(x=dimensions, y=slopes, marker_color=colors)])

        fig.update_layout(
            title="Current Coherence Slopes by Dimension",
            xaxis_title="Dimension",
            yaxis_title="Slope (dC/dt)",
            showlegend=False,
        )

        return fig

    def _plot_attractor_activations(self) -> go.Figure:
        """Plot attractor activation history."""

        att_log = self.audit_log_dir / "attractor_log.jsonl"
        if not att_log.exists():
            return go.Figure()

        df = pd.read_json(att_log, lines=True)

        fig = go.Figure()

        for att_type in ["origin", "reciprocity", "nonharm"]:
            subset = df[
                df["data"].apply(lambda x: att_type in x.get("similarities", {}))
            ]
            if not subset.empty:
                timestamps = pd.to_datetime(subset["timestamp"])
                values = subset["data"].apply(lambda x: x["similarities"][att_type])

                fig.add_trace(
                    go.Scatter(
                        x=timestamps,
                        y=values,
                        mode="lines",
                        name=att_type.capitalize(),
                    )
                )

        fig.update_layout(
            title="Attractor Activation Strengths",
            xaxis_title="Time",
            yaxis_title="Cosine Similarity",
            hovermode="x unified",
        )

        return fig

    def _empty_dashboard(self):
        """Return empty state for dashboard."""
        empty_fig = go.Figure()
        empty_fig.update_layout(title="No data yet")

        return (
            "Waiting for data...",
            {"textAlign": "center"},
            "—",
            {"textAlign": "center"},
            "—",
            empty_fig,
            empty_fig,
            empty_fig,
        )

    def run(self, debug: bool = True, port: int = 8050) -> None:
        """Launch dashboard server."""
        print(f"🚀 CSI Dashboard starting at http://localhost:{port}")
        self.app.run_server(debug=debug, port=port)


if __name__ == "__main__":
    dashboard = CSIDashboard(audit_log_dir=Path("./checkpoints/audit_logs"))
    dashboard.run()
