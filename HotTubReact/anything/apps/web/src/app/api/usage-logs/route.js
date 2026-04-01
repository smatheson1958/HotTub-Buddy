import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const logs = await sql`
      SELECT * FROM usage_logs 
      ORDER BY usage_date DESC, usage_time DESC
    `;
    return Response.json(logs);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch usage logs" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { usage_date, usage_time, num_users, duration_minutes } = body;

    const [newLog] = await sql`
      INSERT INTO usage_logs (usage_date, usage_time, num_users, duration_minutes)
      VALUES (${usage_date}, ${usage_time}, ${num_users}, ${duration_minutes})
      RETURNING *
    `;

    return Response.json(newLog);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create usage log" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, usage_date, usage_time, num_users, duration_minutes } = body;

    const [updatedLog] = await sql`
      UPDATE usage_logs
      SET usage_date = ${usage_date},
          usage_time = ${usage_time},
          num_users = ${num_users},
          duration_minutes = ${duration_minutes}
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json(updatedLog);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to update usage log" },
      { status: 500 },
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    await sql`DELETE FROM usage_logs WHERE id = ${id}`;

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to delete usage log" },
      { status: 500 },
    );
  }
}
