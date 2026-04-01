import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const logs = await sql`
      SELECT * FROM hot_tub_logs 
      ORDER BY log_date DESC, log_time DESC 
      LIMIT 50
    `;
    return Response.json(logs);
  } catch (error) {
    console.error("Error fetching hot tub logs:", error);
    return Response.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      log_date,
      log_time,
      sanitizer_free,
      sanitizer_combined_or_total,
      ph,
      notes,
      added_sanitizer,
      added_ph_up,
      added_ph_down,
    } = body;

    const [newLog] = await sql`
      INSERT INTO hot_tub_logs (
        log_date, 
        log_time, 
        sanitizer_free, 
        sanitizer_combined_or_total, 
        ph, 
        notes, 
        added_sanitizer, 
        added_ph_up, 
        added_ph_down
      ) VALUES (
        ${log_date || null}, 
        ${log_time || null}, 
        ${sanitizer_free || null}, 
        ${sanitizer_combined_or_total || null}, 
        ${ph || null}, 
        ${notes || ""}, 
        ${added_sanitizer || 0}, 
        ${added_ph_up || 0}, 
        ${added_ph_down || 0}
      )
      RETURNING *
    `;

    return Response.json(newLog);
  } catch (error) {
    console.error("Error creating hot tub log:", error);
    return Response.json({ error: "Failed to create log" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      id,
      log_date,
      log_time,
      sanitizer_free,
      sanitizer_combined_or_total,
      ph,
      notes,
      added_sanitizer,
      added_ph_up,
      added_ph_down,
    } = body;

    if (!id) {
      return Response.json({ error: "ID is required" }, { status: 400 });
    }

    const [updatedLog] = await sql`
      UPDATE hot_tub_logs 
      SET 
        log_date = ${log_date}, 
        log_time = ${log_time}, 
        sanitizer_free = ${sanitizer_free}, 
        sanitizer_combined_or_total = ${sanitizer_combined_or_total}, 
        ph = ${ph}, 
        notes = ${notes}, 
        added_sanitizer = ${added_sanitizer}, 
        added_ph_up = ${added_ph_up}, 
        added_ph_down = ${added_ph_down}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!updatedLog) {
      return Response.json({ error: "Log not found" }, { status: 404 });
    }

    return Response.json(updatedLog);
  } catch (error) {
    console.error("Error updating hot tub log:", error);
    return Response.json({ error: "Failed to update log" }, { status: 500 });
  }
}
