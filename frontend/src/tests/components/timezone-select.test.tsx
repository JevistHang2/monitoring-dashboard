import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TimezoneSelect } from "@/components/dashboard/timezone-select";

describe("TimezoneSelect", () => {
  it("renders the selected timezone label", () => {
    render(<TimezoneSelect value="Asia/Jakarta" onChange={vi.fn()} />);

    expect(screen.getByText("Indonesia / Jakarta")).toBeInTheDocument();
  });

  it("calls onChange when a timezone is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TimezoneSelect value="Asia/Jakarta" onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Singapore"));

    expect(onChange).toHaveBeenCalledWith("Asia/Singapore");
  });
});
