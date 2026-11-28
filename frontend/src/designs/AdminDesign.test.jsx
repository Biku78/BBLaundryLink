// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import { api } from "../services/api";
import { adminActions } from "../services/adminApi";
import AdminDesign from "../designs/AdminDesign";

function makeStore(user = { Name: "Rakesh Panda", Email: "admin@bbll.in", Role: "admin" }) {
  return configureStore({
    reducer: { auth: authReducer, [api.reducerPath]: api.reducer },
    middleware: (getDefault) => getDefault().concat(api.middleware),
    preloadedState: { auth: { token: "test-token", user } },
  });
}

function renderAdmin() {
  return render(
    <Provider store={makeStore()}>
      <MemoryRouter>
        <AdminDesign />
      </MemoryRouter>
    </Provider>,
  );
}

beforeEach(() => window.localStorage.clear());
afterEach(cleanup);

describe("admin console", () => {
  it("renders the overview with the brand logo and KPI tiles", () => {
    renderAdmin();
    expect(screen.getByAltText("BB LaundryLink")).toBeTruthy();
    expect(screen.getByText(/You control the platform/i)).toBeTruthy();
    expect(screen.getAllByText(/Total orders/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Partner approval queue")).toBeTruthy();
  });

  it("moves between panels from the navbar", async () => {
    renderAdmin();
    const nav = screen.getAllByRole("navigation")[0];
    fireEvent.click(within(nav).getByRole("button", { name: /Orders/ }));
    expect(await screen.findByText("Order desk")).toBeTruthy();
    fireEvent.click(within(screen.getAllByRole("navigation")[0]).getByRole("button", { name: /Customers/ }));
    expect(await screen.findByText(/Lifetime spend/i)).toBeTruthy();
  });

  it("approves a pending partner and drops the queue count", () => {
    renderAdmin();
    const before = screen.getByText(/partner applications waiting/i).textContent;
    const approve = screen.getAllByRole("button", { name: /^Approve$/ }).length
      ? screen.getAllByRole("button", { name: /^Approve$/ })
      : screen.getAllByRole("button", { name: /Approve/ });
    fireEvent.click(approve[0]);
    expect(screen.getByText(/approved and live/i)).toBeTruthy();
    const after = screen.getByText(/partner applications waiting/i).textContent;
    expect(after).not.toBe(before);
  });

  it("persists an order status change to local storage", async () => {
    renderAdmin();
    fireEvent.click(within(screen.getAllByRole("navigation")[0]).getByRole("button", { name: /Orders/ }));
    const advance = (await screen.findAllByRole("button", { name: /Mark / }))[0];
    fireEvent.click(advance);
    const saved = JSON.parse(window.localStorage.getItem("bbll:admin:v1"));
    expect(saved.orders.some((o) => ["Picked up", "In wash", "Confirmed", "Ready"].includes(o.status))).toBe(true);
  });

  it("updates a service price through the pricing panel", async () => {
    renderAdmin();
    fireEvent.click(within(screen.getAllByRole("navigation")[0]).getByRole("button", { name: /Services/ }));
    const input = await screen.findByLabelText("Wash & Fold price");
    fireEvent.change(input, { target: { value: "65" } });
    fireEvent.click(screen.getByRole("button", { name: "Save Wash & Fold price" }));
    expect(JSON.parse(window.localStorage.getItem("bbll:admin:v1")).services.find((s) => s.id === "wash-fold").price).toBe(65);
  });

  it("resets demo data back to the seed", async () => {
    adminActions.cancelOrder("BB-2841");
    renderAdmin();
    const dock = screen.getAllByRole("navigation").at(-1);
    fireEvent.click(within(dock).getByRole("button", { name: /Settings/ }));
    fireEvent.click(await screen.findByRole("button", { name: /Reset demo data/i }));
    const saved = JSON.parse(window.localStorage.getItem("bbll:admin:v1"));
    expect(saved.orders.find((o) => o.id === "BB-2841").status).toBe("In wash");
  });
});
