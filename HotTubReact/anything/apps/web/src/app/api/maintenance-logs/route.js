import sql from "@/app/api/utils/sql";

export async function GET() {
  try {
    const logs = await sql`
      SELECT * FROM maintenance_logs 
      ORDER BY log_date DESC, created_at DESC
    `;
    return Response.json(logs);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch maintenance logs" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { log_date, log_time, action, notes, filter_changed } = body;

    if (!action) {
      return Response.json({ error: "Action is required" }, { status: 400 });
    }

    const [newLog] = await sql`
      INSERT INTO maintenance_logs (log_date, log_time, action, notes, filter_changed)
      VALUES (
        ${log_date || new Date().toISOString().split("T")[0]}, 
        ${log_time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })}, 
        ${action}, 
        ${notes},
        ${filter_changed || false}
      )
      RETURNING *
    `;

    return Response.json(newLog);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create maintenance log" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, log_date, log_time, action, notes, filter_changed } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    if (!action) {
      return Response.json({ error: "Action is required" }, { status: 400 });
    }

    const [updatedLog] = await sql`
      UPDATE maintenance_logs 
      SET 
        log_date = ${log_date}, 
        log_time = ${log_time},
        action = ${action}, 
        notes = ${notes},
        filter_changed = ${filter_changed || false}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedLog) {
      return Response.json({ error: "Log not found" }, { status: 404 });
    }

    return Response.json(updatedLog);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update maintenance log" },
      { status: 500 },
    );
  }
}
